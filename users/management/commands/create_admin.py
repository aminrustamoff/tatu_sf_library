import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create admin user"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "Admin123456")

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING("Admin user already exists"))
            return

        User.objects.create_superuser(
            username=username,
            password=password
        )

        self.stdout.write(self.style.SUCCESS("Admin user created successfully"))