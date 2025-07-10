from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUserProfile(AbstractUser):
    """ Extension of the default user model to include additional fields. 
    
    Extra Fields (TODO: Update as needed):

    due_date: For pregnant users, the expected due date of their child.

    pregancy_week: The current week of pregnancy, calculated from the due date.

    doctor_info: Information about the user's doctor, such as name and contact details.
    """

    due_date = models.DateField(null=True, blank=True, help_text="Expected due date for pregnant users.")
    pregnancy_week = models.PositiveIntegerField(null=True, blank=True, help_text="Current week of pregnancy.")
    doctor_info = models.TextField(null=True, blank=True, help_text="Information about the user's doctor.")

    def __str__(self):
        return self.username