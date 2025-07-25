# Generated by Django 5.2.4 on 2025-07-22 18:52

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MoodLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tags', models.CharField(choices=[('happy', 'Happy'), ('sad', 'Sad'), ('anxious', 'Anxious'), ('excited', 'Excited')], help_text='Mood tag for this log (e.g., happy, sad, anxious, excited).', max_length=50)),
                ('notes', models.TextField(blank=True, help_text='Optional notes or description for the mood log.')),
                ('timestamp', models.DateTimeField(auto_now_add=True, help_text='Timestamp when the mood log was created.')),
                ('user', models.ForeignKey(help_text='User who created the mood log.', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
