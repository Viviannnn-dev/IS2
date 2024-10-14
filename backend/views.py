from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer, WorkspaceSerializer 
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status 
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Workspace

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Verificar si el usuario existe y validar la contraseña
    try:
        user = User.objects.get(username=username)
        if not user.check_password(password):
            return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)

        return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()  # Guardar el usuario
        user.set_password(user.password)  # Asegurarse de que la contraseña esté encriptada
        user.save()

        token = Token.objects.create(user=user)  # Crea el token

        return Response({'token': token.key}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_workspace(request):
    serializer = WorkspaceSerializer(data=request.data)

    if serializer.is_valid():
        workspace = serializer.save()  # Guarda la nueva instancia en la base de datos
        return Response(serializer.data, status=status.HTTP_201_CREATED)  # Devuelve los datos del workspace creado con el estado 201

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Devuelve errores si los datos no son válidos

@api_view(['GET'])
@permission_classes([AllowAny])  # Permitir el acceso a todos (puedes cambiar a IsAuthenticated si lo deseas)
def get_workspaces(request, workspace_id=None):
    if workspace_id is not None:
        # Si se proporciona un workspace_id, intenta obtener ese workspace
        try:
            workspace = Workspace.objects.get(id=workspace_id)
            serializer = WorkspaceSerializer(workspace)
            return Response(serializer.data, status=status.HTTP_200_OK)  # Devuelve los datos del workspace
        except Workspace.DoesNotExist:
            return Response({'error': 'Workspace no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Si no se proporciona workspace_id, lista todos los workspaces
        workspaces = Workspace.objects.all()  # Obtener todos los workspaces
        serializer = WorkspaceSerializer(workspaces, many=True)  # Serializa la lista de workspaces
        return Response(serializer.data, status=status.HTTP_200_OK)  # Devuelve la lista de workspaces
