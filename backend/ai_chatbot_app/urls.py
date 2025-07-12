from django.urls import path
from . import views

urlpatterns = [
    path('', views.chatbot, name='chatbot'),  # this will respond to /chatbot/
]
