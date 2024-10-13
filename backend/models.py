from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)  # Cambié 'user' a 'owner' para mantener consistencia

    def __str__(self):
        return self.name


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=[('todo', 'To Do'), ('doing', 'Doing'), ('done', 'Done')])
    project = models.ForeignKey(Project, related_name='tasks', on_delete=models.CASCADE, null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(blank=True, null=True)  # Opcional
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')  # Opcional

    def __str__(self):
        return self.title
