from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ...backend.models import Project, Task
from ..serializers import ProjectSerializer, TaskSerializer
from django.shortcuts import render
from django.contrib.auth.models import User  # Importa correctamente el modelo User

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra las tareas para mostrar solo las del usuario autenticado
        return self.queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Guarda la tarea y establece el propietario como el usuario autenticado
        serializer.save(owner=self.request.user)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


def obtener_usuarios(request):
    # Función de vista para obtener todos los usuarios
    usuarios = User.objects.all()  # Obtiene todos los usuarios
    return render(request, 'usuarios.html', {'usuarios': usuarios})
