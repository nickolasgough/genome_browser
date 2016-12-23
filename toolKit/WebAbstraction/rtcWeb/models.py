from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.forms import UserCreationForm

# Create your models here.


class appUserManager(BaseUserManager):
    def create_user(self, usernm , color ,password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not usernm:
            raise ValueError('Users must have an email address')

        if appUser.objects.filter(username=usernm):
           raise ValueError(u'Username "%s" is already in use.' % usernm)

        user = self.model(
            username=usernm,
            color=color,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password,color=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        if color == None:
            color = "#FFFFFF"
        user = self.create_user(usernm=username,
            color=color,
            password=password
        )
        user.is_admin = True
        user.save(using=self._db)
        return user



class appUser(AbstractBaseUser):
     username = models.CharField(max_length=765, blank=True, unique=True)
     color = models.CharField(max_length=200)
     USERNAME_FIELD = 'username'
     objects = appUserManager()
     REQUIRED_FIELDS = ['color']
     is_active = models.BooleanField(default=True)
     is_admin = models.BooleanField(default=False)

     def get_full_name(self):
         # The user is identified by their email address
         return self.username

     def get_short_name(self):
         # The user is identified by their email address
         return self.username

     def __str__(self):  # __unicode__ on Python 2
         return self.username

     def has_perm(self, perm, obj=None):
   #      "Does the user have a specific permission?"
         # Simplest possible answer: Yes, always
         return True

     def has_module_perms(self, app_label):
       #  "Does the user have permissions to view the app `app_label`?"
         # Simplest possible answer: Yes, always
         return True

     @property
     def is_staff(self):
         #"Is the user a member of staff?"
         # Simplest possible answer: All admins are staff
         return self.is_admin
