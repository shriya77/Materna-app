from django.test import TestCase
# Create your tests here.
from django.contrib.auth import get_user_model
from .models import SymptomLog

class SymptomLogModelTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpass', firebase_uid='testuid', age=30, trimester=2, due_date='2025-12-31'
        )

    def test_create_symptom_log(self):
        log = SymptomLog.objects.create(
            user=self.user,
            type='headache',
            severity=2,
            frequency='daily'
        )
        self.assertEqual(log.type, 'headache')
        self.assertEqual(log.severity, 2)
        self.assertEqual(log.frequency, 'daily')
        self.assertEqual(log.user, self.user)

# Create your tests here.
