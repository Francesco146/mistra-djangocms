from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, TestViewSet, TestExecutionViewSet


router = DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'tests', TestViewSet)
router.register(r'categories', TestExecutionViewSet)

urlpatterns = router.urls