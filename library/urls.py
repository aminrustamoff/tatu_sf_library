from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    AIQueryView,
    BookViewSet,
    CurrentUserView,
    NoteViewSet,
    NotificationViewSet,
    ReadingProgressViewSet,
    UserListView,
    UserDetailView,
)

router = DefaultRouter()
router.register('books', BookViewSet, basename='books')
router.register('notes', NoteViewSet, basename='notes')
router.register('notifications', NotificationViewSet, basename='notifications')
router.register('progress', ReadingProgressViewSet, basename='progress')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', obtain_auth_token, name='api-login'),
    path('auth/user/', CurrentUserView.as_view(), name='api-user'),
    path('auth/users/', UserListView.as_view(), name='user-list'),
    path('auth/users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('ai/query/', AIQueryView.as_view(), name='ai-query'),
]
