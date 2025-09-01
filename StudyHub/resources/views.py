from rest_framework import viewsets, permissions,response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter

from resources import models, serializers
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = models.Subject.objects.all()
    serializer_class = serializers.SubjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ResourceFilter(filters.FilterSet):
    subject_name = filters.CharFilter(field_name='subject__name', lookup_expr='icontains')
    tags_name = filters.CharFilter(field_name='tags__name', lookup_expr='icontains')
    resource_type = filters.CharFilter(field_name='resource_type', lookup_expr='exact')

    class Meta:
        model = models.Resource
        fields = ['resource_type', 'subject_name', 'tags_name']

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = models.Resource.objects.all()
    serializer_class = serializers.ResourceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = ResourceFilter
    search_fields = ['title']

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def types(self, request):
        types = [{"key": key, "label": label} for key, label in models.Resource.RESOURCE_TYPES]
        return response.Response(types)