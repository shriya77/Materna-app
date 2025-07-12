from django.test import TestCase, Client
import json

class ChatbotTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = '/chatbot/'

    def test_valid_request_returns_response(self):
        payload = {
            "user_message": "I feel worried",
            "mood": "anxious",
            "pregnancy_week": 10,
            "intent_type": "emotional_support"
        }
        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("response", response.json())
        self.assertIn("metadata", response.json())
        self.assertEqual(response.json()["metadata"]["intent_type"], "emotional_support")

    def test_missing_fields_returns_400(self):
        payload = {
            "user_message": "Hello"
            # missing mood, pregnancy_week, intent_type
        }
        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())
        self.assertIn("fields", response.json())

    def test_invalid_method_returns_405(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        self.assertIn("error", response.json())
