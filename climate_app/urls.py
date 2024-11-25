from django.urls import path
from . import views
from .views import ClimateDataView

urlpatterns = [
    path('temperature/', views.TemperatureView.as_view(), name='temperature'),
    path('humidity/', views.HumidityView.as_view(), name='humidity'),
    path('api/climate-data/', ClimateDataView.as_view(), name='climate-data'),
]
