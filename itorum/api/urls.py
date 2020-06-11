from django.urls import path

from . import views

urlpatterns = [
    path('orders_info', views.orders_info, name='orders_info'),
    path('auth_ui', views.auth_ui, name='auth_ui'),
    path('log_out', views.log_out, name='log_out'),
    path('orders', views.orders, name='orders'),
    path('customers', views.customers, name='customers'),
]