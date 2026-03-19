from django.contrib import admin

from .models import Conversation, ConversationParticipant, Message, MessageReadState


class ConversationParticipantInline(admin.TabularInline):
    model = ConversationParticipant
    extra = 0


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'project', 'proposal', 'contract', 'created_by', 'created_at')
    search_fields = ('subject', 'created_by__email')
    inlines = [ConversationParticipantInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'sender', 'created_at')
    search_fields = ('sender__email', 'content')


@admin.register(MessageReadState)
class MessageReadStateAdmin(admin.ModelAdmin):
    list_display = ('id', 'message', 'user', 'read_at')
    search_fields = ('user__email',)
