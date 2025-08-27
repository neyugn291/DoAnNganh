from django.db.migrations.operations import models
from  rest_framework import serializers
from users import models

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = "__all__"
        read_only_fields = ['id', 'is_verified']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = models.Profile
        fields = ['id', 'user', 'user_id', 'avatar', 'bio', 'contact_info']
        read_only_fields = ['id']