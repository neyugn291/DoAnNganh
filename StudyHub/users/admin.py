from django.contrib import admin
from .models import User

class UserAppAdminSite(admin.AdminSite):
    site_header = 'Users Management'


user_admin_site = UserAppAdminSite(name='user_admin')


class UserAdmin(admin.ModelAdmin):
    list_display = ['username','']


user_admin_site.register(User)