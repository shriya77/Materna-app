# backend/Materna/users_app/authentication.py

from rest_framework import authentication, exceptions
from django.contrib.auth import get_user_model
from firebase_admin import auth as firebase_auth
from firebase_admin import exceptions as firebase_exceptions

class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class for Django REST Framework that verifies
    Firebase ID tokens.
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None # No Bearer token, let other authentication classes handle it

        id_token = auth_header.split(' ')[1]

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            uid = decoded_token['uid'] # Firebase User ID

        except firebase_exceptions.AuthError as e:
            raise exceptions.AuthenticationFailed(f'Invalid Firebase ID token: {e}')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Authentication failed due to an unexpected error: {e}')

        # Link the Firebase user to a Django user
        CustomUser = get_user_model()
        try:
            # Use firebase_uid for get_or_create, as it's designed to be unique.
            user, created = CustomUser.objects.get_or_create(firebase_uid=uid)

            if created:
                print(f"New Django user created for Firebase UID: {uid}")
                user.username = uid # Ensure username is set to a unique value upon creation
                user.email = decoded_token.get('email', '')
                user.first_name = decoded_token.get('name', '').split(' ')[0] if decoded_token.get('name') else ''
                user.last_name = ' '.join(decoded_token.get('name', '').split(' ')[1:]) if decoded_token.get('name') else ''
                user.save() # Save changes to the newly created user
            else:
                print(f"Existing Django user found for Firebase UID: {uid}")
                
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            return (user, decoded_token)

        except Exception as e:
            # More specific error handling if needed, but this catches general DB issues.
            raise exceptions.AuthenticationFailed(f'Error retrieving or creating Django user: {e}')