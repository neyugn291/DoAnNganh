from django.db import models
from users.models import User, BaseModel
from django import forms
from cloudinary.models import CloudinaryField
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, null=False)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Course(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = CloudinaryField('thumbnail', blank=True, null=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    tags = models.ManyToManyField(Tag, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_free = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.is_free:
            self.price = 0
        elif self.price > 0:
            self.is_free = False
        super().save(*args, **kwargs)

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    document = CloudinaryField('file',resource_type="auto", blank=True, null=True)

    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.module.title} - {self.title}"

class Enrollment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "course")  # 1 user không thể đăng ký 1 course nhiều lần

    def __str__(self):
        return f"{self.user} → {self.course}"
# class Interaction(BaseModel):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
#     lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='interactions')
#
#     class Meta:
#         abstract = True
#
# class Like(Interaction):
#     active = models.BooleanField(default=True)
