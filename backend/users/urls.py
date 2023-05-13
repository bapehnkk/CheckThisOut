from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('validate_field/', views.validate_user_field, name='validate_field'),

    path('', views.get_users, name='get_users'),
]
