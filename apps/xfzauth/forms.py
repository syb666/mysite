# -*- coding: utf-8 -*-
from django import forms
from apps.forms import FormMixin
from django.core.cache import cache
from .models import User
#ForMixin必须传进入
class LoginForm(forms.Form,FormMixin):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(max_length=20,min_length=6,error_messages={"max_length":"密码最多不能超过20个字符！","min_length":"密码最少不能少于6个字符！"})
    remember = forms.BooleanField(required=False)

class RegisterForm(forms.Form,FormMixin):
    telephone = forms.CharField(max_length=11)
    username = forms.CharField(max_length=20)
    password1 = forms.CharField(max_length=20, min_length=6,
                               error_messages={"max_length": "密码最多不能超过20个字符！", "min_length": "密码最少不能少于6个字符！"})
    password2 = forms.CharField(max_length=20, min_length=6,
                                error_messages={"max_length": "密码最多不能超过20个字符！", "min_length": "密码最少不能少于6个字符！"})
    img_captcha = forms.CharField(min_length=4,max_length=4)
    sms_captcha = forms.CharField(min_length=4,max_length=4)

    def clean(self):
        cleaned_data = super(RegisterForm,self).clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1!=password2:
            raise ValueError("俩次密码不一致")

        #验证验证码，先从缓存中取
        cache_img = cleaned_data.get('img_captcha')
        cache_clean_img = cache.get(cache_img.lower())
        if not cache_clean_img or cache_clean_img.lower()!=cache_img.lower():
            forms.ValidationError("验证码错误")
        # 验证手机验证码，先从缓存中取
        telephone = cleaned_data.get('telephone')
        tel_code = cache.get(telephone)
        cache_ma = cleaned_data.get('sms-captcha-btn')
        if not tel_code or tel_code.lower()!=cache_ma.lower():
            forms.ValidationError("手机验证码错误")

        #手机号不能重复，手机号验证
        exists = User.objects.filter(telephone=telephone).exists()
        if exists:
            forms.ValidationError("此手机号已经存在")

        return cleaned_data



class ChangeUserForm(forms.Form,FormMixin):
    # uid = forms.IntegerField()
    telephone = forms.CharField(max_length=11)
    username = forms.CharField(max_length=20)
    email = forms.EmailField(max_length=50)
    #password = forms.CharField(max_length=20, min_length=6,
    #                          error_messages={"max_length": "密码最多不能超过20个字符！", "min_length": "密码最少不能少于6个字符！"})








