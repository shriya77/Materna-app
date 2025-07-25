from django.db import models
from django.conf import settings


class SymptomLog(models.Model):
    SYMPTOM_TYPES = [
        ('headache', 'Headache'),
        ('nausea', 'Nausea'),
        ('fatigue', 'Fatigue'),
        # Add more types as needed
    ]

    SEVERITY_CHOICES = [
        (1, 'Mild'),
        (2, 'Moderate'),
        (3, 'Severe'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        help_text="User who logged the symptom."
    )
    type = models.CharField(
        max_length=50,
        choices=SYMPTOM_TYPES,
        help_text="Type of symptom (e.g., headache, nausea, fatigue)."
    )
    severity = models.IntegerField(
        choices=SEVERITY_CHOICES,
        help_text="Severity of the symptom: 1=Mild, 2=Moderate, 3=Severe."
    )
    frequency = models.CharField(
        max_length=50,
        help_text="Frequency of the symptom (e.g., daily, weekly)."
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the symptom was logged."
    )

    def __str__(self):
        return f"{self.user} - {self.type} ({self.severity}) (Symptom ID: {self.id})"

