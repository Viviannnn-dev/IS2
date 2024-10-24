from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Workspace, Board, List, Card, Task

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']  # Incluye 'email' en los campos
        extra_kwargs = {'password': {'write_only': True}}  # La contraseña solo se puede escribir

    def create(self, validated_data):
        email = validated_data.get('email')  # Obtener email o None
        user = User(username=validated_data['username'], email=email)  # Crear usuario
        user.set_password(validated_data['password'])  # Encriptar la contraseña
        user.save()
        return user

    def validate_email(self, value):
        if value and User.objects.filter(email=value).exists():  # Solo verificar si hay valor
            raise serializers.ValidationError("Este email ya está en uso.")
        return value

class WorkspaceSerializer(serializers.ModelSerializer):
    users = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())  #Le mandamos el id del usuario

    class Meta:
        model = Workspace
        fields = ['id', 'description', 'name', 'status', 'users']  

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ['id', 'name', 'workspace']

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ['id', 'name', 'maxWIP', 'board']

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'name', 'description', 'created_at', 'due_date', 'owner', 'label', 'list']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'status', 'alert', 'due_date', 'card']

