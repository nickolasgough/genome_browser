from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,redirect
from .models import appUser
from django.core.urlresolvers import reverse
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login,logout

def registerPage(request):
        return render(request, 'rtcWeb/register.html')

def registerPageU(request):
        return render(request, 'rtcWeb/register.html',{'username_error': "Username already exists"})

def registerPageP(request):
    return render(request, 'rtcWeb/register.html', {'password_error': "try to make it stronger"})

def logoutView(request):
    logout(request)
    return render(request,'rtcWeb/login.html')

def loginView(request):
    return render(request,'rtcWeb/login.html')

def loginViewE(request):
    return render(request, 'rtcWeb/login.html', {'login_error':"Username/Password Incorrect"})

@login_required
def loginSuccess(request):
    name = request.session['name']
    color = request.session['color']
    return render(request,"rtcWeb/paint.html",{'name':name,'color':color})


def loginCheck(request):
    username = request.POST["name"]
    password = request.POST["password"]
    user = authenticate(username=username, password=password)
    if user:
         login(request, user)
         request.session['name'] = username
         request.session['color'] = user.color
         return HttpResponseRedirect(reverse('paint'))
    else:
         return HttpResponseRedirect(reverse('loginE'))


def yahooView(request):
    return render(request,'rtcWeb/pageToBeShared')



def register(request):
    username = request.POST["name"]
    password = request.POST["password"]
    color = request.POST["color"]
    try:
        validate_password(password, user=None, password_validators=None)
    except ValidationError as e:
        return HttpResponseRedirect(reverse('registerPError'))
    try:
        appUser.objects.create_user(usernm=username,color=color,password=password)
        return HttpResponseRedirect('login')

    except ValueError as s:
        return HttpResponseRedirect(reverse('registerUError'))


def changeColor(request):
    username = request.POST["name"]
    color = request.POST["color"]
    tempUser = appUser.objects.get(username=username)
    tempUser.color = color
    tempUser.save()
    return render(request,"rtcWeb/paint.html");






