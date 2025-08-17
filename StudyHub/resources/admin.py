from django.contrib import admin

from resources.models import Resource, Subject


# Register your models here.

class ResourceAppAdminSite(admin.AdminSite):
    site_header = 'Resources Management'

resource_admin_site = ResourceAppAdminSite(name='resource_admin')

resource_admin_site.register(Resource)
resource_admin_site.register(Subject)
