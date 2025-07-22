from rest_framework import serializers
from .models import SymptomLog

class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = SymptomLog
        fields = ["user", "type", "severity", "frequency", "timestamp"]

        