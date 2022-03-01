from django.shortcuts import render

def home(request):
    dict = {}
    return render(request, 'front/home.html', dict)
