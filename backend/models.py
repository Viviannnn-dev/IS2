from django.db import models
from django.contrib.auth.models import User


class Workspace(models.Model):
    description = models.TextField()
    name = models.CharField(max_length=50)
    status = models.CharField(
        max_length=50,
            choices=[
            ('active', 'Active'),  # Cambié para que sea una tupla
            ('inactive', 'Inactive')  # Cambié para que sea una tupla
        ],
        default='active'
    )
    # Lista de usuarios asociados al Workspace (muchos a muchos)
    users = models.ManyToManyField(User, related_name='workspaces')

    def __str__(self):
        return self.name

class Board(models.Model):
    name = models.CharField(max_length=50)
    #una lista de LISTAS
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='boards')  # Relación 1:M

    def __str__(self):
        return self.name


class List(models.Model):
    name = models.CharField(max_length=50)
    maxWIP = models.IntegerField()  # Definido como campo de modelo
    board = models.ForeignKey('Board', on_delete=models.CASCADE, related_name='lists')  # Relación 1:M con Board

    def __str__(self):
        return self.name


class Card(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)  # Campo opcional, puede estar vacío
    created_at = models.DateField (auto_now_add=True)  # Se añade automáticamente
    due_date = models.DateField (blank=True, null=True)  # Campo opcional, puede estar vacío y no tiene valor por defecto
    owner = models.ForeignKey(User, on_delete=models.CASCADE)  # Relación 1:M con User
    label = models.CharField(max_length=10, blank=True)  # Campo opcional, puede estar vacío
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name='cards')  # Relación M:1 con List

    def __str__(self):
        return self.name
    
class Task(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()  # Asegúrate de agregar paréntesis
    status = models.CharField(
        max_length=50,
        choices=[
            ('open', 'Open'),
            ('closed', 'Closed')
        ],
        default='open'
    )
    alert = models.BooleanField(default=False)  # Cambiado a BooleanField con valor por defecto
    due_date = models.DateField()  # Cambiado a DateField en inglés
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='tasks')

    def __str__(self):
        return self.name
    
    
    
