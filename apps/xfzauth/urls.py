# -*- coding: utf-8 -*-
from django.urls import path
from . import views
app_name='xfzauth'
urlpatterns = [
    path('login/',views.login_view,name='login'),
    path('logout/',views.logout_view,name='logout'),
    path('img_captcha/',views.img_captcha,name='img_captcha'),
    path('sms_captcha/',views.sms_captcha,name='sms_captcha'),
    path('cache_test/',views.cache_test,name='cache_test'),
    path('register/',views.register,name='register'),
    path('save_person/',views.save_person,name='save_person'),

]