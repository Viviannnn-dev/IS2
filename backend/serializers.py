from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Workspace, Board, List, Card, Task

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email', 'password']  # Asegúrate de incluir 'email' en los campos
        extra_kwargs = {'password': {'write_only': True}} # Agrega otros campos que necesites

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])  # Asegúrate de encriptar la contraseña
        user.save()
        return user

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
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

