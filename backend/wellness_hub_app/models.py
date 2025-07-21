from django.db import models
from django.conf import settings

class MoodLog(models.Model):
    TAG_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('anxious', 'Anxious'),
        ('excited', 'Excited'),
        # Add more tags as needed
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        help_text="User who created the mood log."
    )
    tags = models.CharField(
        max_length=50,
        choices=TAG_CHOICES,
        help_text="Mood tag for this log (e.g., happy, sad, anxious, excited)."
    )
    notes = models.TextField(
        blank=True,
        help_text="Optional notes or description for the mood log."
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the mood log was created."
    )

    def __str__(self):
        return f"{self.user} - {self.tags}"



