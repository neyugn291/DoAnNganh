from django.contrib import admin

from discussions import models


class DiscussAppAdminSite(admin.AdminSite):
    site_header = 'Discusses Management'

discuss_admin_site = DiscussAppAdminSite(name='discuss_admin')

discuss_admin_site.register(models.Question)
discuss_admin_site.register(models.Vote)
discuss_admin_site.register(models.Answer)
discuss_admin_site.register(models.Comment)