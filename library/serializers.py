from rest_framework import serializers
from .models import Book, Note, Notification, ReadingProgress


class BookSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'year',
            'category',
            'format',
            'rating',
            'citations',
            'description',
            'cover',
            'cover_url',
            'file',
            'file_url',
            'created_at',
        ]

    def get_cover_url(self, obj):
        request = self.context.get('request')
        if obj.cover and request:
            return request.build_absolute_uri(obj.cover.url)
        return None

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'user', 'book', 'text', 'created_at']
        read_only_fields = ['user']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'text', 'is_read', 'created_at']


class ReadingProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingProgress
        fields = ['id', 'user', 'book', 'current_page', 'total_pages', 'updated_at']
        read_only_fields = ['user']