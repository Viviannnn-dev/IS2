from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer, WorkspaceSerializer, BoardSerializer, ListSerializer, CardSerializer, TaskSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status 
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Workspace,Board,List,Card, Task

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

@api_view(['GET'])
@permission_classes([AllowAny])  # Cambia a IsAuthenticated si deseas restringir el acceso
def get_boards(request, board_id=None):
    if board_id is not None:
        # Obtener un board específico por ID
        try:
            board = Board.objects.get(id=board_id)
            serializer = BoardSerializer(board)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Board.DoesNotExist:
            return Response({'error': 'Board no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Obtener todos los boards
        boards = Board.objects.all()
        serializer = BoardSerializer(boards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])  # Cambia a IsAuthenticated si deseas restringir el acceso
def create_board(request):
    # Crear un nuevo board
    serializer = BoardSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny]) 
def get_lists(request, list_id=None):
    if list_id is not None:
        # Obtener una lista específica por ID
        try:
            list_obj = List.objects.get(id=list_id)
            serializer = ListSerializer(list_obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except List.DoesNotExist:
            return Response({'error': 'Lista no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Obtener todas las listas
        lists = List.objects.all()
        serializer = ListSerializer(lists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])  
def create_list(request):
    # Crear una nueva lista
    serializer = ListSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])  
def get_cards(request, card_id=None):
    if card_id is not None:
        # Si se proporciona card_id, intenta obtener esa tarjeta
        try:
            card = Card.objects.get(id=card_id)
            serializer = CardSerializer(card)
            return Response(serializer.data, status=status.HTTP_200_OK)  # Devuelve los datos de la tarjeta
        except Card.DoesNotExist:
            return Response({'error': 'Tarjeta no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Si no se proporciona card_id, lista todas las tarjetas
        cards = Card.objects.all()  # Obtener todas las tarjetas
        serializer = CardSerializer(cards, many=True)  # Serializa la lista de tarjetas
        return Response(serializer.data, status=status.HTTP_200_OK)  # Devuelve la lista de tarjetas

@api_view(['POST'])
@permission_classes([AllowAny])  
def create_card(request):
    serializer = CardSerializer(data=request.data)

    if serializer.is_valid():
        card = serializer.save()  # Guarda la nueva tarjeta en la base de datos
        return Response(serializer.data, status=status.HTTP_201_CREATED)  # Devuelve los datos de la tarjeta creada

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Devuelve errores si los datos no son válidos

@api_view(['GET'])
@permission_classes([AllowAny])  
def get_tasks(request, task_id=None):
    if task_id is not None:
        # Si se proporciona task_id, intenta obtener esa tarea
        try:
            task = Task.objects.get(id=task_id)
            serializer = TaskSerializer(task)
            return Response(serializer.data, status=status.HTTP_200_OK)  # Devuelve los datos de la tarea
        except Task.DoesNotExist:
            return Response({'error': 'Tarea no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Si no se proporciona task_id, lista todas las tareas
        tasks = Task.objects.all()  # Obtener todas las tareas
        serializer = TaskSerializer(tasks, many=True)  # Serializa la lista de tareas
        return Response(serializer.data, status=status.HTTP_200_OK)  # Devuelve la lista de tareas

@api_view(['POST'])
@permission_classes([AllowAny])  
def create_task(request):
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        task = serializer.save()  # Guarda la nueva tarea en la base de datos
        return Response(serializer.data, status=status.HTTP_201_CREATED)  # Devuelve los datos de la tarea creada

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Devuelve errores si los datos no son válidos

# Update Workspace
@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])  
def update_workspace(request, workspace_id):
    workspace = get_object_or_404(Workspace, id=workspace_id)
    serializer = WorkspaceSerializer(workspace, data=request.data, partial=True)  # partial=True permite actualizaciones parciales
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update Board
@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])  
def update_board(request, board_id):
    board = get_object_or_404(Board, id=board_id)
    serializer = BoardSerializer(board, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update List
@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])  
def update_list(request, list_id):
    list_obj = get_object_or_404(List, id=list_id)
    serializer = ListSerializer(list_obj, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update Card
@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])  
def update_card(request, card_id):
    card = get_object_or_404(Card, id=card_id)
    serializer = CardSerializer(card, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update Task
@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])  
def update_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)