from django.contrib import admin

from notifications import models


class NotificationAppAdminSite(admin.AdminSite):
    site_header = 'Notifications Management'

notification_admin_site = NotificationAppAdminSite(name='notification_admin')

notification_admin_site.register(models.Notification)
