# from django.shortcuts import render

from django.http import JsonResponse
from .models import SymptomLog
from .serializers import SymptomSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

@api_view(['GET','POST'])
def symptom_list(request):
    '''
    Get all symptoms given a user. 
    Return as JSON.
    '''

    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

    user_instance = request.user

    print(user_instance)

    if request.method == 'GET':
        symptoms = SymptomLog.objects.filter(user = user_instance)
        serializer = SymptomSerializer(symptoms, many=True)
        return Response(serializer.data)
    
    if request.method == "POST":
        serializer = SymptomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user_instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) #TODO Not sure what status to set to
        
@api_view(['GET','PUT', 'DELETE'])
def symptom_detail(request, id):

    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

    user_instance = request.user

    try: 
        symptom_log = SymptomLog.objects.filter(user=user_instance).get(pk=id) # Not sure if we need filter by user
    except SymptomLog.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = SymptomSerializer(symptom_log)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = SymptomSerializer(symptom_log, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        symptom_log.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)