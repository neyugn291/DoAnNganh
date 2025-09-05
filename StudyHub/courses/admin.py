from django.contrib import admin
from django.template.response import TemplateResponse

from .models import Category, Course, Tag, Module, Lesson, Enrollment
from django.utils.safestring import mark_safe
from django.urls import path
from . import dao
import json


class CourseAppAdminSite(admin.AdminSite):
    site_header = 'Courses Management'

    def get_urls(self):
        return [
            path('stats/', self.stats_view)
        ] + super().get_urls()

    def stats_view(self, request):
        stats = {
            "by_category": list(dao.count_courses_by_category()),
            "by_tag": list(dao.count_courses_by_tag()),
            "free_vs_paid": dao.count_free_vs_paid_courses(),
            "top_courses": list(dao.top_courses_by_students()),
            "by_month": list(dao.count_courses_by_month()),
            "revenue_per_course": list(dao.revenue_per_course()),
            "enrollment_by_month": list(dao.enrollment_by_month())
        }

        stats_json = mark_safe(json.dumps(stats))
        return TemplateResponse(request, 'admin/stats.html', {
            "stats": stats_json
        })


course_admin_site = CourseAppAdminSite(name='course_admin')

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']

class CourseAdmin(admin.ModelAdmin):
    list_display = ['id','title','thumbnail_preview','price','category','active','created_at']
    readonly_fields = ['thumbnail_preview']
    list_filter = ['active', 'category', 'created_at']
    ordering = ['-created_at']

    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return mark_safe(f'<img src="{obj.thumbnail.url}" style="max-height:80px; max-width:160px;" />')
        return "(No thumbnail)"

class ModuleAdmin(admin.ModelAdmin):
    list_display = ['id','title', 'order']

class TagAdmin(admin.ModelAdmin):
    search_fields = ['name']



course_admin_site.register(Category, CategoryAdmin)
course_admin_site.register(Course, CourseAdmin)
course_admin_site.register(Tag)
course_admin_site.register(Module, ModuleAdmin)
course_admin_site.register(Lesson)
course_admin_site.register(Enrollment)