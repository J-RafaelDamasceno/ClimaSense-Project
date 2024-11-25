from django.shortcuts import render,HttpResponse,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login
# Create your views here.

def HomePage(request):
    return render (request, 'home.html')

def SignupPage(request):
    if request.method=='POST':
        username=request.POST.get('username')
        email=request.POST.get('email')
        password=request.POST.get('password')
        my_user=User.objects.create_user(username,email,password)
        my_user.save()
        return redirect('login')

    return render (request, 'login.html')
    # return render (request, 'signup.html') original

def LoginPage(request):
    if request.method=='POST':
        username=request.POST.get('username')
        password=request.POST.get('password')
        user=authenticate(request,username=username,password=password)
        if user is not None:
            login(request,user)
            return redirect('home')
        else:
            return HttpResponse("Username or password is incorrect")

    return render (request, 'login.html')