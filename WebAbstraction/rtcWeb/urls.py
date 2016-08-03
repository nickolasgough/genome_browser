from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.registerPage, name='registerPage'),
    url(r'^UError$', views.registerPageU, name='registerUError'),
    url(r'^PError$', views.registerPageP, name='registerPError'),
    url(r'^register*', views.register, name='register'),
    url(r'^login$', views.loginView, name='loginV'),
    url(r'^loginError$', views.loginViewE, name='loginE'),
    url(r'^loginCheck', views.loginCheck, name='loginC'),
    url(r'^paint/logout', views.logoutView, name='logout'),
    url(r'^paint/changeColor', views.changeColor, name='changeColor'),
    url(r'^paint/', views.loginSuccess, name='paint'),
    url(r'^pageToBeShared/', views.yahooView, name='page'),




]