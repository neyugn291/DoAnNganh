from django.contrib import admin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


from .models import User, Profile

class UserAppAdminSite(admin.AdminSite):
    site_header = 'Users Management'


user_admin_site = UserAppAdminSite(name='user_admin')


class UserAdmin(BaseUserAdmin):
    model = User
    add_form = UserCreationForm
    form = UserChangeForm
    list_display = ['username', 'email', 'is_active', 'is_staff']
    list_filter = ['is_staff', 'is_active']
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_active')}
         ),
    )
    search_fields = ['username', 'email']
    ordering = ['username']

class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "bio", "contact_info")
    search_fields = ("user__username", "user__email")

user_admin_site.register(User, UserAdmin)
user_admin_site.register(Profile, ProfileAdmin)