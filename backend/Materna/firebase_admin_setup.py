# backend/Materna/Materna/firebase_admin_setup.py

import firebase_admin
from firebase_admin import credentials
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT_KEY_PATH = os.path.join(BASE_DIR, 'firebase-service-account.json')

if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK initialized successfully.")
    except FileNotFoundError:
        print(f"Error: Firebase service account key not found at {SERVICE_ACCOUNT_KEY_PATH}")
        print("Please ensure 'firebase-service-account' is in the correct location or update the path.")
    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {e}")