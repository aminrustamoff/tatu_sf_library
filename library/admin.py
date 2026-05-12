from django.contrib import admin
from .models import Book, Note, Notification, ReadingProgress


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'year', 'category', 'format', 'rating', 'created_at')
    search_fields = ('title', 'author', 'category')
    list_filter = ('category', 'format', 'year')


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'created_at')
    search_fields = ('text', 'user__username', 'book__title')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('text', 'user', 'is_read', 'created_at')
    list_filter = ('is_read',)


@admin.register(ReadingProgress)
class ReadingProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'current_page', 'total_pages', 'updated_at')