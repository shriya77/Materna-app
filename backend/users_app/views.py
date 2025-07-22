# backend/Materna/users/views.py

# Add 'permission_classes' to the import from rest_framework.decorators
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUserProfile
from .serializers import CustomUserProfileSerializer
from django.views.decorators.csrf import csrf_exempt # Import this
from rest_framework.permissions import IsAuthenticated # Already there, good!

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def profile_view(request):
    """
    API endpoint for retrieving and updating the authenticated CustomUserProfile.
    Now relies on DRF's authentication classes (including your FirebaseAuthentication)
    and permissions.
    """
    user_profile_instance = request.user

    if request.method == 'GET':
        serializer = CustomUserProfileSerializer(user_profile_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = CustomUserProfileSerializer(user_profile_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)