from rest_framework import serializers
from .models import SymptomLog

class SymptomSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = SymptomLog
        fields = ["id", "user", "type", "severity", "frequency", "timestamp"]

        