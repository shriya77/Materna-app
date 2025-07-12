from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def chatbot(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed."}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)

    # Validate required fields
    # ========================================

    # Define required fields
    required_fields = ['user_message', 'mood', 'pregnancy_week', 'intent_type']

    # Check if all required fields are present
    missing_fields = [f for f in required_fields if f not in data]
    if missing_fields:
        return JsonResponse({"error": "Missing fields", "fields": missing_fields}, status=400)
    
    # Check if fields are not empty
    for field in required_fields:
        if not data[field]:
            return JsonResponse({"error": f"{field} cannot be empty."}, status=400)
    
    # Validate field types
    if not isinstance(data['user_message'], str):
        return JsonResponse({"error": "user_message must be a string."}, status=400)
    if not isinstance(data['mood'], str):
        return JsonResponse({"error": "mood must be a string."}, status=400)
    if not isinstance(data['pregnancy_week'], int):
        return JsonResponse({"error": "pregnancy_week must be an integer."}, status=400)
    if not isinstance(data['intent_type'], str):
        return JsonResponse({"error": "intent_type must be a string."}, status=400)
    # ========================================

    # Extract data
    # ========================================
    user_message = data['user_message']
    mood = data['mood']
    pregnancy_week = data['pregnancy_week']
    intent_type = data['intent_type']
    # =========================================

    # Validate intent_type
    # ========================================
    intent_types = ["symptom_advice", "emotional_support", "faq"]
    # We may not need to check for intent_type, but in case we do here it is
    if intent_type not in intent_types:
        return JsonResponse({"error": "Invalid intent type."}, status=400) 
    # ========================================

    # Placeholder for AI response logic 
    # ========================================
    try:
        # Placeholder response logic
        if intent_type == "symptom_advice":
            response_text = "Try to rest and stay hydrated. If symptoms worsen, call your doctor."
        elif intent_type == "emotional_support":
            response_text = "I’m here for you. It’s completely normal to feel that way."
        elif intent_type == "faq":
            response_text = "Let me find an FAQ answer for you."
        else:
            response_text = "Thank you for sharing. Tell me more."
    except Exception:
        return JsonResponse({
            "error": "AI unavailable",
            "message": "Sorry, please try again later."
        }, status=503)
    # ========================================

    # Return the response
    return JsonResponse({
        "response": response_text,
        "metadata": {
            "intent_type": intent_type,
            "mood": mood,
            "pregnancy_week": pregnancy_week
        }
    })
