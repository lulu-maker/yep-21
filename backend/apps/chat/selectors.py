from .models import Conversation, Message


def list_user_conversations(user):
    return Conversation.objects.filter(participants__user=user).distinct().prefetch_related('participants__user')


def list_conversation_messages(*, conversation, user):
    if not conversation.participants.filter(user=user).exists():
        return Message.objects.none()
    return conversation.messages.select_related('sender')
