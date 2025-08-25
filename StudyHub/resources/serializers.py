from rest_framework import serializers
from resources import models
from courses.models import Tag


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subject
        fields = ["id", "name", "description"]


class ResourceSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Subject.objects.all(), source="subject", write_only=True
    )

    tags = serializers.StringRelatedField(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, source="tags", write_only=True
    )

    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = models.Resource
        fields = [
            "id",
            "title",
            "description",
            "file",
            "resource_type",
            "subject",
            "subject_id",
            "tags",
            "tag_ids",
            "uploaded_by",
            "uploaded_at",
        ]
        read_only_fields = ["id", "uploaded_by", "uploaded_at"]

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        resource = models.Resource.objects.create(**validated_data)
        if tags:
            resource.tags.set(tags)
        return resource

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance
