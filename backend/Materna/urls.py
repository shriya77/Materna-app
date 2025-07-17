"""
URL configuration for Materna project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def placeholder_view(request):
    return HttpResponse("<h1>Welcome! This is the placeholder homepage.</h1>")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('wellness/', include('wellness_hub_app.urls')),
    path('chatbot/', include('ai_chatbot_app.urls')),
    path('users/', include('users_app.urls')),
    path('', placeholder_view, name='placeholder_home'),  # Placeholder homepage
]
