# -*- coding: utf-8 -*-


import requests

def send(mobile,captcha):
    url = 'http://v.juhe.cn/sms/send'
    params = {
        'mobile':mobile,
        'tpl_id':'125048',
        'tpl_value':'#code#='+captcha,
        'key':'759f80df7cb561339f9f10eb65158d7b'
    }
    response = requests.get(url,params=params)
    result = response.json()
    if result['error_code'] == 0:
        return True
    else:
        return False