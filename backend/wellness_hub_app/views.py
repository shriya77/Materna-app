from django.shortcuts import render

# Create your views here.

def wellness_hub(request):
    return render(request, 'wellness_hub_template/wellness_hub.html', {})