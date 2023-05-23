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

from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .token import account_activation_token
from django.core.mail import EmailMessage
from .tasks import delete_user_if_not_in_group


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            user = User.objects.get(email=request.data['email'])
            user.is_active = False
            user.save()
            refresh = RefreshToken.for_user(user)
            delete_user_if_not_in_group.apply_async(args=[user.id], countdown=30)

            # to get the domain of the current site
            current_site = get_current_site(request)
            mail_subject = 'Activation link has been sent to your email id'
            message = render_to_string('acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': account_activation_token.make_token(user),
            })
            email = EmailMessage(
                mail_subject, message, to=[request.data['email']]
            )
            email.send()
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(data=response.data, status=status.HTTP_400_BAD_REQUEST)


def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return Response(data='Thank you for your email confirmation. Now you can login your account.')
    else:
        return Response(data='Activation link is invalid!', status=status.HTTP_400_BAD_REQUEST)


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
