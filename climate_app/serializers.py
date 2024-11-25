from rest_framework import serializers
from .models import ClimateData

class ClimateDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClimateData
        fields = ['temperature', 'humidity', 'timestamp']
