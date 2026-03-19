from django.core.exceptions import PermissionDenied
from django.utils import timezone

from apps.notifications.models import NotificationType
from apps.notifications.services import create_notification

from .models import Conversation, ConversationParticipant, Message, MessageReadState
from .tasks import fanout_chat_event


def create_conversation(*, created_by, participants, subject='', project=None, proposal=None, contract=None):
    conversation = Conversation.objects.create(
        subject=subject,
        created_by=created_by,
        project=project,
        proposal=proposal,
        contract=contract,
    )
    user_ids = {created_by.id, *[p.id for p in participants]}
    ConversationParticipant.objects.bulk_create([
        ConversationParticipant(conversation=conversation, user_id=user_id) for user_id in user_ids
    ])
    return conversation


def send_message(*, conversation, sender, content, attachment_url=''):
    if not conversation.participants.filter(user=sender).exists():
        raise PermissionDenied('Sender is not a participant in this conversation.')

    message = Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content,
        attachment_url=attachment_url,
    )
    fanout_chat_event.delay(str(message.id))
    recipients = conversation.participants.exclude(user=sender).select_related('user')
    for participant in recipients:
        create_notification(
            recipient=participant.user,
            notification_type=NotificationType.MESSAGE_RECEIVED,
            payload={'conversation_id': conversation.id, 'message_id': message.id},
        )
    return message


def mark_conversation_read(*, conversation, user):
    now = timezone.now()
    ConversationParticipant.objects.filter(conversation=conversation, user=user).update(last_read_at=now)
    unread_messages = conversation.messages.exclude(sender=user).exclude(read_states__user=user)
    MessageReadState.objects.bulk_create(
        [MessageReadState(message=message, user=user, read_at=now) for message in unread_messages],
        ignore_conflicts=True,
    )
