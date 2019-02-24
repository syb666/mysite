# -*- coding: utf-8 -*-
from django.shortcuts import render,redirect,reverse
from apps.xfzauth.models import User
from django.views.generic import View
from django.contrib.auth.models import Group
from apps.xfzauth.decorators import xfz_superuser_required
from django.views.decorators.http import require_GET,require_POST
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import permission_required
from django.contrib import messages
from apps.xfzauth.serializers import UserSerializer
from utils import restful

@permission_required(perm='news.change_user',login_url='index')
def staffs_view(request):
    staffs = User.objects.filter(is_staff=True)
    # print(len(staffs))
    context = {
        'staffs':staffs
    }
    return render(request, 'cms/staffs.html',context=context)

@method_decorator(xfz_superuser_required,name='dispatch')
class addStaff_view(View):
    def get(self,request):
        groups = Group.objects.all()
        context = {
            'groups':groups
        }
        # for gr in groups:
        #     print(gr.name)
        return render(request,'cms/add_staff.html',context=context)
    def post(self,request):
        telephone = request.POST.get('telephone')
        print(telephone)
        user = User.objects.get(telephone=telephone)
        if user:
            user.is_staff=True
            #这里主要是获取多个name为groups
            groups_id = request.POST.getlist('groups')
            groups = Group.objects.filter(pk__in=groups_id)
            user.groups.set(groups)
            user.save()
            return redirect(reverse('cms:staffs'))
        else:
            messages.info(request,'没有该手机号')
            return redirect(reverse('cms:staffs'))

@permission_required(perm='news.delete_user',login_url='index')
def deleteStaff(request):
    staffId = request.POST.get('staffTelephone')
    User.objects.filter(telephone=staffId).delete()
    return restful.ok()


@method_decorator(permission_required(perm='news.change_user',login_url='index'),name='dispatch')
class edit_staff(View):
    def get(self,request):
        staffUid = request.GET.get('staffUid')

        users = User.objects.get(uid=staffUid)
        groups = Group.objects.all()
        context = {
            'groups': groups,
            'users':users,
        }
        return render(request,'cms/editStaff.html',context=context)
    def post(self,request):
        telephone = request.POST.get('telephone')
        username = request.POST.get('username')
        uid = request.POST.get('uid')
        user = User.objects.get(uid=uid)
        user.username = username
        user.telephone = telephone
        groups_id = request.POST.getlist('groups')
        groups = Group.objects.filter(pk__in=groups_id)
        user.groups.set(groups)
        user.save()
        return redirect(reverse('cms:staffs'))