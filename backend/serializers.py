from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Workspace

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Asegúrate de que la contraseña sea solo escritura

    class Meta:
        model = User
        fields = ['username', 'password', 'email']  # Agrega otros campos que necesites

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
        fields = ['description', 'name', 'status', 'users']  
