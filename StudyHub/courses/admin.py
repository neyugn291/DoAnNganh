from django.contrib import admin
from django.template.response import TemplateResponse

from .models import Category, Course, Tag, Module, Lesson
from django.utils.safestring import mark_safe
from django.urls import path
from . import dao

class CourseAppAdminSite(admin.AdminSite):
    site_header = 'Courses Management'

    def get_urls(self):
        return [
            path('stats/', self.stats_view)
        ] + super().get_urls()

    def stats_view(self, request):
        return TemplateResponse(request, 'admin/stats.html', {
            'course_stats':dao.count_courses_by_category()
        })


course_admin_site = CourseAppAdminSite(name='course_admin')

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']

class CourseAdmin(admin.ModelAdmin):
    list_display = ['id','title','thumbnail_preview','price','category','active','created_at']
    readonly_fields = ['thumbnail_preview']

    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return mark_safe(f'<img src="{obj.thumbnail.url}" width="160" height="80" />')
        return "(No thumbnail)"

class ModuleAdmin(admin.ModelAdmin):
    list_display = ['id','title', 'order']


course_admin_site.register(Category, CategoryAdmin)
course_admin_site.register(Course, CourseAdmin)
course_admin_site.register(Tag)
course_admin_site.register(Module, ModuleAdmin)
course_admin_site.register(Lesson)