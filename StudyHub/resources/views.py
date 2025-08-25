from rest_framework import viewsets, permissions
from resources import models, serializers


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = models.Subject.objects.all()
    serializer_class = serializers.SubjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = models.Resource.objects.all()
    serializer_class = serializers.ResourceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
