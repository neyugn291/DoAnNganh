from django.contrib import admin

from quizzes import models


class QuizzAppAdminSite(admin.AdminSite):
    site_header = 'Discusses Management'

quizz_admin_site = QuizzAppAdminSite(name='quizz_admin')

quizz_admin_site.register(models.Question)
quizz_admin_site.register(models.Quiz)
quizz_admin_site.register(models.Answer)
quizz_admin_site.register(models.Choice)
quizz_admin_site.register(models.Submission)
