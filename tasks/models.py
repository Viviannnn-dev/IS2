from django.db import models
from django.contrib.auth.models import User

class user(models.Model):  
    name = models.CharField(max_length=50)
    password = models.CharField(max_length=9)
    email = models.CharField(max_length=50)
    # AutenticacionSSO ?

    def __str__(self):
        return self.name

class Workspace(models.Model):
    description = models.TextField
    name = models.CharField(max_length=50)
    status = models.CharField(
        max_length=50,
        choices=[
            ('active'),
            ('inactive')
        ],
        default='active'
    )
    # Lista de usuarios asociados al Workspace (muchos a muchos)
    users = models.ManyToManyField(Users, related_name='workspaces')

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
    description = models.TextField()  # Asegúrate de agregar paréntesis
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)  # Relación 1:M con User
    label = models.CharField(max_length=10)
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
    
