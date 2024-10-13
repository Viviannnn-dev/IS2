from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.api_views import ProjectViewSet, TaskViewSet
from .views.html_views import obtener_usuarios


# Crear un enrutador de Django REST Framework
router = DefaultRouter()
# Registrar el ViewSet en el enrutador
router.register(r'tasks', TaskViewSet) # Ruta para tareas
router.register(r'projects', ProjectViewSet)  # Ruta para proyectos


urlpatterns = [
    path('', include(router.urls)),
    path('usuarios/', obtener_usuarios, name='obtener_usuarios'),  # Ruta para obtener usuarios
]
