from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def login(request):
    # Verifica si el usuario y la contraseña son correctos
    # Si son correctos, devuelve un token de acceso
    # Si no son correctos, devuelve un mensaje de error
    return Response({})


@api_view(['POST'])
def register(request):
    # Registra un nuevo usuario
    # Si el usuario se registra correctamente, devuelve un mensaje de éxito
    # Si no se registra correctamente, devuelve un mensaje de error
    print(request.data)
    return Response({'message': 'Register'})


@api_view(['GET'])  
def logout(request):
    # Cierra la sesión del usuario
    return Response({'message': 'Logout'})


@api_view(['GET'])
def profile(request):
    # Obtiene el perfil del usuario autenticado
    return Response({'message': 'Profile'})



