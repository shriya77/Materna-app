from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUserProfile

admin.site.register(CustomUserProfile, UserAdmin)

# Register your models here.
