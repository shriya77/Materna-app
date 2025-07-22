from django.urls import path
from symptom_checker_app import views

urlpatterns = [
    path('symptoms/', views.symptom_list),
    path('symptoms/<int:id>', views.symptom_detail),
]