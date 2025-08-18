# backend/Materna/users/serializers.py

from rest_framework import serializers
from .models import CustomUserProfile  

class CustomUserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUserProfile model, directly exposing its fields.
    """
    class Meta:
        model = CustomUserProfile
        fields = ['first_name',
            'last_name',
            'email',
            'age',
            'trimester',
            'due_date',
            'pregnancy_week',
            'doctor_info',
            'status',
            'emergency',
            'partner_email',
            'tag1',
            'tag2']

    def get_name(self, obj):
        """
        Returns the full name by combining first_name and last_name.
        This method is called automatically by DRF for the 'name' field.
        """
        return f"{obj.first_name} {obj.last_name}".strip()


