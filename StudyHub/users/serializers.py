from django.db.migrations.operations import models
from  rest_framework import serializers
from users import models

class UserSummarySerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = models.User
        fields = ['id', 'profile', 'username', 'first_name', 'last_name']

    def get_profile(self, obj):
        profile = getattr(obj, "profile", None)
        if profile:
            return ProfileSerializer(profile).data
        return None


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.User
        fields = "__all__"
        read_only_fields = ['id', 'is_verified']

    def get_profile(self, obj):
        profile = getattr(obj, "profile", None)
        if profile:
            return ProfileSerializer(profile).data
        return None

    def update(self, instance, validated_data):
        # Lấy dữ liệu profile nếu có
        profile_data = validated_data.pop("profile", {})
        avatar = profile_data.get("avatar")

        # Cập nhật avatar nếu có
        if avatar:
            instance.profile.avatar = avatar
            instance.profile.save()

        # Update các field khác của User
        return super().update(instance, validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = ['id', 'avatar', 'bio', 'contact_info']
        read_only_fields = ['id']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # Nếu có avatar thì trả về URL đầy đủ
        if instance.avatar:
            rep['avatar'] = instance.avatar.url.replace("http://", "https://")
        else:
            rep['avatar'] = None
        return rep
