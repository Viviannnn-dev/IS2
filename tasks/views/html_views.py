from django.shortcuts import render
from django.contrib.auth.models import User

def obtener_usuarios(request):
    usuarios = User.objects.all()  # Obtiene todos los usuarios
    return render(request, 'tasks/usuarios.html', {'usuarios': usuarios})
