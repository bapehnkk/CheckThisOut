import json

from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, validate_password
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            user = User.objects.get(email=request.data['email'])
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(data=response.data, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({"access_token": access_token})
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def validate_user_field(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        field_name = data.get('field_name')
        field_value = data.get('field_value')

        # Создаем временный экземпляр пользователя для проверки поля
        user = User(**{field_name: field_value})

        if field_name == 'password':
            # Проверяем пароль на сложность
            try:
                validate_password(field_value)
            except ValidationError as e:
                # Возвращаем ошибку в случае неудачной проверки
                ret = {'error': {'password': str(e)}}
                print(f"\n\n{ret}\n\n")
                return JsonResponse({'error': {"password": list(e)}}, status=400)
        else:
            # Используем full_clean для проверки поля
            try:
                user.full_clean(exclude=[f.name for f in User._meta.fields if f.name != field_name])
            except ValidationError as e:
                # Возвращаем ошибку в случае неудачной проверки
                return JsonResponse({'error': dict(e)}, status=400)

        # Возвращаем успешный ответ, если поле валидно
        return JsonResponse({}, status=200)


def get_users(request):
    users = User.objects.all()
    users_list = []

    for user in users:
        users_list.append({
            'id': user.id,
            'username': user.username,
            'active': user.is_active,  # Используйте is_active для активного статуса
        })

    return JsonResponse(users_list, safe=False)
