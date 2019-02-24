# -*- coding: utf-8 -*-
from datetime import datetime
from django import template
from django.utils.timezone import localtime,now as now_func#为了获取本地时间，根据setting中设置的
register = template.Library()

@register.filter
def time_since(value):
    if not isinstance(value,datetime):
        return value
    else:
        now = now_func()#获取清楚地时间
        timedely = (now-value).total_seconds()
        if timedely<60:
            return "刚刚"
        elif timedely>=60 and timedely<60*60:
            m = timedely//60
            return "%d分钟前" % m
        elif timedely>=60*60 and timedely<60*60*24:
            m = timedely // (60*60)
            return "%d小时前"%m
        elif timedely>=60*60*24 and timedely<=60*60*24*30:
            m = timedely // (60*60*24)
            return "%d天前"%m
        else:
            return value.strftime("%Y-%m-%d %H:%M:%S")


@register.filter
def time_Strf(value):
    if not isinstance(value,datetime):
        return value
    return localtime(value).strftime("%Y-%m-%d %H:%M:%S")

