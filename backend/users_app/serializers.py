# backend/Materna/users/serializers.py

from rest_framework import serializers
from .models import CustomUserProfile  

class CustomUserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUserProfile model, directly exposing its fields.
    """
    class Meta:
        model = CustomUserProfile
        fields = ['due_date', 'pregnancy_week', 'doctor_info']  

