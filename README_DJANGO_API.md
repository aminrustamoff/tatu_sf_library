# TATUSF ARM MVP — Django API ulash bo‘yicha qisqa yo‘riqnoma

Bu frontend quyidagi asosiy sahifalarga qisqartirildi:

- Login
- Bosh sahifa
- Katalog
- Kitob detail / reader
- Profil
- Admin kitob qo‘shish
- Dark mode
- Til tanlash: uz / ru / en

## Frontend API sozlamasi

`script.js` ichida:

```js
const API_BASE = window.API_BASE || '/api';
```

Django endpointlar `/api/...` ko‘rinishida bo‘lsa, hech narsani o‘zgartirish shart emas.

## Kerakli endpointlar

```txt
POST /api/auth/login/
GET  /api/books/
POST /api/books/
GET  /api/books/<id>/   optional
GET  /api/profile/      optional
```

API ishlamasa, sayt demo data bilan ochiladi.

## Django model namunasi

```python
from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    year = models.PositiveIntegerField()
    category = models.CharField(max_length=100)
    format = models.CharField(max_length=20, default='PDF')
    rating = models.FloatField(default=4.5)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='books/', blank=True, null=True)
    cover = models.ImageField(upload_to='covers/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

## DRF serializer/viewset namunasi

```python
from rest_framework import serializers, viewsets
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.order_by('-created_at')
    serializer_class = BookSerializer
```

## urls.py namunasi

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

router = DefaultRouter()
router.register('books', BookViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
```
