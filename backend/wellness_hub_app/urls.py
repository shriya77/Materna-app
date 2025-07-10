from django.urls import path
from . import views

urlpatterns = [
    path('', views.wellness_hub, name='wellness_hub'),
]