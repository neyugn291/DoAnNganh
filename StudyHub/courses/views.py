from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, generics
from courses import serializers, models

# Create your views here.

class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer

