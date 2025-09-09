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

class LessonSerializer(serializers.ModelSerializer):
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Lesson
        fields = ['id', 'module','title', 'content', 'document', 'order', 'document_url']

    def get_document_url(self, obj):
        if obj.document:
            return obj.document.url
        return None

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = models.Module
        fields = ['id', 'course', 'title', 'order', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    tags = serializers.StringRelatedField(many=True)
    thumbnail_url = serializers.SerializerMethodField()

    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = models.Course
        fields = [
            'id', 'title', 'description', 'thumbnail_url',
            'instructor', 'instructor_name',
            'category', 'category_name',
            'tags', 'price', 'is_free',
            'modules'
        ]
        read_only_fields = ['id', 'instructor_name', 'category_name']

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None



class EnrollmentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    course = serializers.PrimaryKeyRelatedField(
        queryset=models.Course.objects.all()
    )

    class Meta:
        model = models.Enrollment
        fields = ["id", "user", "course", "enrolled_at"]


