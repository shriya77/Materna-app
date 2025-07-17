# backend/Materna/Materna/firebase_auth_middleware.py

from firebase_admin import auth as firebase_auth
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.db import IntegrityError

import Materna.firebase_admin_setup

class FirebaseAuthMiddleware:
    """
    Middleware to verify Firebase ID tokens and attach Firebase user data
    to the request. It also ensures a corresponding Django CustomUserProfile exists.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if auth_header and auth_header.startswith('Bearer '):
            id_token = auth_header[7:]

            try:
                decoded_token = firebase_auth.verify_id_token(id_token)
                uid = decoded_token['uid']

                CustomUser = get_user_model()
                try:
                    user, created = CustomUser.objects.get_or_create(username=uid)
                    if created:
                        user.email = decoded_token.get('email', '')
                        user.first_name = decoded_token.get('name', '').split(' ')[0] if decoded_token.get('name') else ''
                        user.last_name = ' '.join(decoded_token.get('name', '').split(' ')[1:]) if decoded_token.get('name') else ''
                        user.save()
                    request.user = user 
                    request.firebase_user_decoded_token = decoded_token
                except IntegrityError:
                    user = CustomUser.objects.get(username=uid)
                    request.user = user
                    request.firebase_user_decoded_token = decoded_token

            except firebase_auth.InvalidIdTokenError:
                return JsonResponse({'error': 'Invalid or expired Firebase ID token.'}, status=401)
            except Exception as e:
                print(f"Error during Firebase token verification: {e}")
                return JsonResponse({'error': 'Authentication failed due to an unexpected error.'}, status=500)
        else:
            request.user = None
            request.firebase_user_decoded_token = None

        return self.get_response(request)

