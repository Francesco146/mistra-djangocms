from rest_framework import viewsets
from .models import *
from .serializers import *

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class TestExecutionViewSet(viewsets.ModelViewSet):
    queryset = TestExecution.objects.all()
    serializer_class = TestExecutionSerializer

class SexViewSet(viewsets.ReadOnlyModelViewSet):  # solo GET (list, retrieve)
    queryset = Sex.objects.all()
    serializer_class = SexSerializer