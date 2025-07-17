# backend/Materna/users/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse  
from .models import CustomUserProfile  
from .serializers import CustomUserProfileSerializer  

@api_view(['GET', 'PUT'])
def profile_view(request):
    """
    API endpoint for retrieving and updating the authenticated CustomUserProfile.
    Relies on FirebaseAuthMiddleware to populate request.user.
    """

    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

  
    user_profile_instance = request.user

    if request.method == 'GET':
        serializer = CustomUserProfileSerializer(user_profile_instance) # Use the corrected serializer name
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = CustomUserProfileSerializer(user_profile_instance, data=request.data, partial=True) # Use the corrected serializer name
        if serializer.is_valid():
            serializer.save() # This saves changes directly to the CustomUserProfile instance
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

