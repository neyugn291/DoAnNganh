from courses import models
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    course_count = serializers.SerializerMethodField()

    class Meta:
        model = models.Category
        fields = ['id', 'name', 'course_count']
        read_only_fields = ['id']
        extra_kwargs = {
            'name': {'required': True, 'allow_blank': False}
        }

    def get_course_count(self, obj):
        return obj.course_set.count()

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tag
        fields = "__all__"

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = serializers.StringRelatedField(many=True)  # hiện tên Tag thay vì id

    class Meta:
        model = models.Course
        fields = [
            'id', 'title', 'description', 'thumbnail',
            'instructor', 'instructor_name',
            'category', 'category_name',
            'tags', 'price', 'is_free', 'students'
        ]
        read_only_fields = ['id', 'instructor_name', 'category_name']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lesson
        fields = ['id', 'title', 'content', 'document', 'order']


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = models.Module
        fields = ['id', 'course', 'title', 'order', 'lessons']
