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
from django.urls import include,path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.documentation import include_docs_urls # importar la funcion include_docs_urls de rest_framework.documentation
from rest_framework import routers # importar la libreria routers de rest_framework
from backend import api_views # importar las vistas de la aplicacion tasks
 

'''urlpatterns = [
    path('admin/', admin.site.urls),
]'''
#Crear vistas de login y registro:
urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', api_views.login),
    path('register/', api_views.register),
    path('logout/', api_views.logout),
    path('profile/', api_views.profile),
    path('api/', include('tasks.urls')), # Incluir las rutas de la aplicacion tasks
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

