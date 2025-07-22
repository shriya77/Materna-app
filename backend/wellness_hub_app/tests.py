from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import MoodLog

class MoodLogModelTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser', password='testpass', firebase_uid='testuid', age=30, trimester=2, due_date='2025-12-31'
        )

    def test_create_mood_log(self):
        log = MoodLog.objects.create(
            user=self.user,
            tags='happy',
            notes='Feeling great today!'
        )
        self.assertEqual(log.tags, 'happy')
        self.assertEqual(log.notes, 'Feeling great today!')
        self.assertEqual(log.user, self.user)
