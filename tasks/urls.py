from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

# Crear un enrutador de Django REST Framework
router = DefaultRouter()
# Registrar el ViewSet en el enrutador
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    # Incluir las URLs generadas por el enrutador
    path('api/', include(router.urls)),
]
