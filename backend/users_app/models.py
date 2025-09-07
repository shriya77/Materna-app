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
    
    status = models.CharField(max_length=50, null=True, blank=True, help_text="Maternal status.")
    emergency = models.CharField(max_length=20, null=True, blank=True, help_text="Emergency contact information.")
    partner_email = models.EmailField(null=True, blank=True, help_text="Partner's email for shared access.")
    tag1 = models.CharField(max_length=50, null=True, blank=True, help_text="First profile tag.")
    tag2 = models.CharField(max_length=50, null=True, blank=True, help_text="Second profile tag.")
    dob = models.DateField(null=True, blank=True, help_text="User's date of birth.")
    phone_number = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        help_text="Phone number in E.164 or local format.",
        validators=[
            RegexValidator(
                regex=r'^\+?[0-9()\-\s]{7,20}$',
                message="Enter a valid phone number (e.g., +15551234567)."
            )
        ],
    )
    # If you want phone numbers to be unique across users, add: unique=True
    
    
    def __str__(self):
        return self.username
