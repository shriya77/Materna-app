from django.db import models
from django.conf import settings

# Create your models here.


class Symptom(models.Model):
    """
    Model for representing symtoms.

    Fields:

    user: ForeignKey to CustomUserProfile, linking the symptom to a user.

    Name: CharField for the name of the symptom.

    Description: TextField for a detailed description of the symptom.

    Date: DateTimeField for when the symptom was recorded.

    Time: TimeField for the time when the symptom was recorded.

    Severity: IntegerField to indicate the severity of the symptom, with a range from 1 to 10.

    Notes: TextField for any additional notes related to the symptom.
    
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='symptoms')
    name = models.CharField(max_length=255, help_text="Name of the symptom.")
    description = models.TextField(help_text="Detailed description of the symptom.")
    date = models.DateTimeField(auto_now_add=True, help_text="Date and time when the symptom was recorded.")
    time = models.TimeField(auto_now_add=True, help_text="Time when the symptom was recorded.")
    severity = models.IntegerField(default=1, help_text="Severity of the symptom on a scale from 1 to 10.")
    notes = models.TextField(null=True, blank=True, help_text="Additional notes related to the symptom.")

    def __str__(self):
        return self.name + " - " + self.description[:50]  # Return a string representation of the symptom with name and a snippet of the description