from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status

# Vista de registro
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Verificar si el usuario ya existe
    if User.objects.filter(username=username).exists():
        return Response({"error": "El usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)

    # Crear el usuario si no existe
    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "Usuario registrado exitosamente"}, status=status.HTTP_201_CREATED)

# Vista de inicio de sesión
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Autenticar al usuario
    user = authenticate(username=username, password=password)
    if user is not None:
        # Inicio de sesión exitoso
        return Response({"message": "Inicio de sesión exitoso"}, status=status.HTTP_200_OK)
    else:
        # Credenciales incorrectas
        return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_400_BAD_REQUEST)
