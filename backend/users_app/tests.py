from django.test import TestCase
from .models import CustomUserProfile

class CustomUserProfileModelTest(TestCase):
    def test_create_custom_user_profile(self):
        user = CustomUserProfile.objects.create_user(
            username='testuser',
            password='testpass',
            firebase_uid='firebase123',
            age=28,
            trimester=2,
            due_date='2025-12-31',
            pregnancy_week=20,
            doctor_info='Dr. Smith, 555-1234'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.firebase_uid, 'firebase123')
        self.assertEqual(user.age, 28)
        self.assertEqual(user.trimester, 2)
        self.assertEqual(str(user.due_date), '2025-12-31')
        self.assertEqual(user.pregnancy_week, 20)
        self.assertEqual(user.doctor_info, 'Dr. Smith, 555-1234')
