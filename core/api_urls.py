from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DespesaViewSet

router = DefaultRouter()
router.register(r'despesas', DespesaViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]