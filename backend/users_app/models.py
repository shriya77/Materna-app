from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUserProfile(AbstractUser):
    """Extension of the default user model to include additional fields."""

    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True, help_text="Firebase UID for authentication.")
    age = models.PositiveIntegerField(null=True, blank=True, help_text="User's age.")
    trimester = models.PositiveSmallIntegerField(null=True, blank=True, help_text="Current trimester (1, 2, or 3).")
    due_date = models.DateField(null=True, blank=True, help_text="Expected due date for pregnant users.")
    pregnancy_week = models.PositiveIntegerField(null=True, blank=True, help_text="Current week of pregnancy.")
    doctor_info = models.TextField(null=True, blank=True, help_text="Information about the user's doctor.")

    def __str__(self):
        return self.username