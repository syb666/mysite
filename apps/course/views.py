# -*- coding: utf-8 -*-

from django.shortcuts import render
from .models import Course

def course_index(request):
    context = {
        'courses':Course.objects.all()
    }
    return render(request,'course/course_index.html',context=context)

def course_detail(request,course_id):
    course = Course.objects.get(pk=course_id)
    context = {
        'course':course
    }
    return render(request,'course/course_detail.html',context=context)

def course_order(request,course_id):
    course = Course.objects.get(pk=course_id)
    context = {
        'course':course
    }
    return render(request,'course/course_order.html',context=context)