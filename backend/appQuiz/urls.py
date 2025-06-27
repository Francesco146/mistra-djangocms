from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    QuestionViewSet, TestViewSet, TestExecutionViewSet, SexViewSet,
    submit_quiz
)

router = DefaultRouter()
router.register(r"questions", QuestionViewSet)
router.register(r"tests", TestViewSet)
router.register(r"categories", TestExecutionViewSet)
router.register(r"sex", SexViewSet)

urlpatterns = router.urls + [
        path("submit-quiz/", submit_quiz),  
]
