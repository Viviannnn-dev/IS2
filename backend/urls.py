"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path 
#from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .views import get_workspaces, get_boards , create_board, get_lists , create_list

'''path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),'''

# Define urlpatterns correctamente
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', views.login),  # Agregar 'api/' para seguir una estructura RESTful
    path('api/register/', views.register),
    path('api/save_workspace/', views.create_workspace), #crear workspace
    path('api/workspace/', get_workspaces, name='list_workspaces'),  # Para listar todos los workspaces
    path('api/workspace/<int:workspace_id>/', get_workspaces, name='get_workspace_by_id'),  # Para obtener uno específico
    path('api/boards/', get_boards, name='list_boards'),  # Para listar todos los boards
    path('api/boards/<int:board_id>/', get_boards, name='get_board_by_id'),  # Para obtener un board específico
    path('api/boards/create/', create_board, name='create_board'),  # Para crear un nuevo board
    path('api/lists/', get_lists, name='list_lists'),  # Para listar todas las listas
    path('api/lists/<int:list_id>/', get_lists, name='get_list_by_id'),  # Para obtener una lista específica
    path('api/lists/create/', create_list, name='create_list'),  # Para crear una nueva lista
    path('api/cards/', views.get_cards, name='get_cards'),# Para listar todas las tarjetas
    path('api/cards/create/', views.create_card, name='create_card'), # Para crear una nueva tarjeta
    path('api/cards/<int:card_id>/', views.get_cards, name='get_card'),  # Para obtener una tarjeta específica
     path('api/tasks/', views.get_tasks, name='get_tasks'),# Para listar todas las tareas
    path('api/tasks/create/', views.create_task, name='create_task'), # Para crear una nueva tarea
    path('api/tasks/<int:task_id>/', views.get_tasks, name='get_task'),  # Para obtener una tarea específica

]



