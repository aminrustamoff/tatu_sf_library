from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import User

from .models import Book, Note, Notification, ReadingProgress
from .serializers import (
    BookSerializer,
    NoteSerializer,
    NotificationSerializer,
    ReadingProgressSerializer,
)

from .services.ai_service import run_ai_prompt


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-created_at')
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'author', 'category']
    ordering_fields = ['year', 'rating', 'created_at']

    @action(detail=False, methods=['get'])
    def recent(self, request):
        books = Book.objects.all().order_by('-created_at')[:6]
        serializer = self.get_serializer(books, many=True, context={'request': request})
        return Response(serializer.data)


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        progress_count = ReadingProgress.objects.filter(user=user).count()
        notes_count = Note.objects.filter(user=user).count()
        unread_count = Notification.objects.filter(user=user, is_read=False).count()
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_admin': user.is_staff,
            'is_superuser': user.is_superuser,
            'date_joined': user.date_joined,
            'progress_count': progress_count,
            'notes_count': notes_count,
            'unread_notifications': unread_count,
        })


def run_ai_prompt(prompt, user=None):
    # TODO: replace this placeholder with your actual AI model integration.
    # You can call a local model, cloud API, or custom inference endpoint here.
    return f"AI model placeholder response for query: '{prompt}'"


class AIQueryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        prompt = str(request.data.get('prompt', '')).strip()

        if not prompt:
            return Response(
                {'detail': 'Prompt is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            response_text = run_ai_prompt(prompt, request.user)

            return Response({
                'prompt': prompt,
                'response': response_text
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'detail': 'AI server bilan ulanishda xatolik yuz berdi.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['patch'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all marked as read'})


class ReadingProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ReadingProgress.objects.filter(user=self.request.user).select_related('book')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def update_progress(self, request):
        book_id = request.data.get('book')
        current_page = request.data.get('current_page', 1)
        total_pages = request.data.get('total_pages', 100)

        obj, created = ReadingProgress.objects.get_or_create(
            user=request.user,
            book_id=book_id,
            defaults={'current_page': current_page, 'total_pages': total_pages}
        )
        if not created:
            obj.current_page = current_page
            obj.total_pages = total_pages
            obj.save()

        serializer = ReadingProgressSerializer(obj)
        return Response(serializer.data)


# ─── Admin: User Management ────────────────────────────────────────────────────

class UserListView(APIView):
    """Admin-only: list all users with stats."""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')
        data = []
        for u in users:
            data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'first_name': u.first_name,
                'last_name': u.last_name,
                'is_staff': u.is_staff,
                'is_active': u.is_active,
                'is_superuser': u.is_superuser,
                'date_joined': u.date_joined.isoformat(),
                'books_count': ReadingProgress.objects.filter(user=u).count(),
                'notes_count': Note.objects.filter(user=u).count(),
            })
        return Response(data)


class UserDetailView(APIView):
    """Admin-only: toggle is_staff / is_active for a user."""
    permission_classes = [permissions.IsAdminUser]

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def patch(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Superuser cannot be demoted by a regular admin
        if user.is_superuser and not request.user.is_superuser:
            return Response({'error': 'Cannot modify superuser'}, status=status.HTTP_403_FORBIDDEN)

        if 'is_staff' in request.data:
            user.is_staff = bool(request.data['is_staff'])
        if 'is_active' in request.data:
            user.is_active = bool(request.data['is_active'])
        user.save()

        return Response({
            'id': user.id,
            'username': user.username,
            'is_staff': user.is_staff,
            'is_active': user.is_active,
        })

    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if user == request.user:
            return Response({'error': 'Cannot delete yourself'}, status=status.HTTP_400_BAD_REQUEST)
        if user.is_superuser:
            return Response({'error': 'Cannot delete superuser'}, status=status.HTTP_403_FORBIDDEN)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
