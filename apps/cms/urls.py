# -*- coding: utf-8 -*-
from django.urls import path
from . import views
from . import course_views
from . import staff_views
app_name = 'cms'
urlpatterns = [
    path('', views.index,name='index'),
    path('news_list/', views.NewsListView.as_view(),name='news_list'),
    path('Writer_news/', views.WriterNewsView.as_view(),name='writer_news'),
    path('EditNewsView/', views.EditNewsView.as_view(),name='EditNewsView'),
    path('news_category/', views.news_category,name='news_category'),
    path('delete_news/', views.delete_news,name='delete_news'),
    path('add_news_category/', views.add_news_category,name='add_news_category'),
    path('edit_news_category/', views.edit_news_category,name='edit_news_category'),
    path('delete_news_category/', views.delete_news_category,name='delete_news_category'),
    path('upload_file/', views.upload_file,name='upload_file'),
    path('banners/', views.banners,name='banners'),
    path('add_banner/', views.add_banner,name='add_banner'),
    path('banner_list/', views.banner_list,name='banner_list'),
    path('delete_banner/', views.delete_banner,name='delete_banner'),
    path('edit_banner/', views.edit_banner,name='edit_banner'),
    path('person_info/',views.person_info,name='person_info'),

    # path('qntoken/', views.qntoken,name='qntoken')
]
#这是课程相关的url映射
urlpatterns+=[
    path('pub_course/',course_views.PubCourse.as_view(),name='pubCourse'),
]

#员工管理
urlpatterns += [
    path('staffs/',staff_views.staffs_view,name='staffs'),
    path('add_staff/',staff_views.addStaff_view.as_view(),name='add_staff'),
    path('deleteStaff/',staff_views.deleteStaff,name='deleteStaff'),
    path('edit_staff/',staff_views.edit_staff.as_view(),name='edit_staff'),
]

