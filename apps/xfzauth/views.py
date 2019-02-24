# -*- coding: utf-8 -*-
from django.contrib.auth import login,logout,authenticate,get_user_model
from django.views.decorators.http import require_POST
from django.http import HttpResponse,JsonResponse
from .forms import LoginForm,RegisterForm,ChangeUserForm
from utils import restful
from django.shortcuts import render,reverse,redirect
from utils.captcha.xfzcaptcha import Captcha
from io import BytesIO
from django.core.cache import cache
from utils import smssender
import random
#from .models import User

User = get_user_model()#跟导入上面的方式一样
@require_POST
def login_view(request):
    form = LoginForm(request.POST)

    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user1 = authenticate(request,telephone=telephone,password=password)#验证是否存在该用户
        if user1:
            if user1.is_active:
                login(request,user1)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth(message="您的账号已经冻结")
        else:
            return restful.params_error(message="您的账号或者密码错误")
    else:
        errors = form.get_errors()

        return restful.params_error(message=errors)

def logout_view(request):
    #退出登录
    logout(request)
    #重定向到index页面
    return redirect(reverse('index'))



@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = User.objects.create_user(telephone=telephone,username=username,password=password)
        login(request,user)
        return restful.ok()
    else:
        print(form.get_errors())
        return restful.params_error(message="注册失败")

#验证码
def img_captcha(request):
    text,image = Captcha.gene_code()
    #BytesIO:相当于一个管道，用来存储图片
    out = BytesIO()
    # 调用image的save方法，将这个image对象保存到BytesIO中
    image.save(out, 'png')
    # 将BytesIO的文件指针移动到最开始的位置
    out.seek(0)

    response = HttpResponse(content_type='image/png')
    # 从BytesIO的管道中，读取出图片数据，保存到response对象上
    response.write(out.read())
    response['Content-length'] = out.tell()#获取文件长度
    # 12Df：12Df.lower()存储在cache中
    cache.set(text.lower(), text.lower(), 5 * 60)

    return response

def sms_captcha(request):
    telephone = request.GET.get('telephone')
    #获取一个随机验证码
    # code = Captcha.gene_text()
    code1 = random.randint(1000,9999)
    code = str(code1)
    # print(code)
    # code+=''
    print(type(code))
    #将telephone,code存到memcached,过期时间5分钟
    cache.set(telephone,code,5*60)
    print("验证码",code)
    # return restful.ok()
    result = smssender.send(telephone,code)
    if result:
        return restful.ok()
    else:
        return restful.params_error(message="短信验证码失败")

def cache_test(request):
    cache.set("username",'sunyabo',5*60)
    result = cache.get("username")
    print(result)
    return HttpResponse("success")

def save_person(request):
    form = ChangeUserForm(request.POST)
    if form.is_valid():
        username = form.cleaned_data.get('username')
        telephone = form.cleaned_data.get('telephone')
        email = form.cleaned_data.get('email')
        #uid = form.cleaned_data.get('uid')
        user1 = request.user#获取当前用户
        user1.email = email
        user1.username = username
        user1.telephone = telephone
        user1.save()
        return restful.ok()
    else:
        return restful.params_error(message="保存失败")
