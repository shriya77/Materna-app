# backend/Materna/apps.py

from django.apps import AppConfig
import os
import firebase_admin
from firebase_admin import credentials
from django.conf import settings # Import settings to access BASE_DIR

class MaternaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Materna' # This should match the name of your Django app if it's 'Materna'

    def ready(self):
        # Ensure Firebase Admin SDK is initialized only once
        if not firebase_admin._apps:
            try:
                # Construct the absolute path to the service account key
                # settings.BASE_DIR points to backend/Materna
                # The service account file is in backend/Materna/Materna/
                SERVICE_ACCOUNT_KEY_PATH = os.path.join(settings.BASE_DIR, 'Materna', 'firebase-service-account.json')

                cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
                firebase_admin.initialize_app(cred)
                print("Firebase Admin SDK initialized successfully from AppConfig.")
            except FileNotFoundError:
                print(f"Error: Firebase service account key not found at {SERVICE_ACCOUNT_KEY_PATH}")
                print("Please ensure 'firebase-service-account.json' is in the correct location or update the path in Materna/apps.py.")
            except Exception as e:
                print(f"Error initializing Firebase Admin SDK from AppConfig: {e}")