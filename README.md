###  学创闻
支持发布新闻信息的发布，对新闻的评论,对某条新闻的搜索，以及付费课程的观看(待完成)<br/>
本平台的模块包含:注册登录模块，新闻详情模块，搜索模块，最新资讯模块，发布新闻模块，</br>
新闻列表模块，新闻分类模块，轮播图模块，员工管理模块，个人中心模块，增删改查模块.<br>
# 环境依赖
## Python包
* Django		2.1.2
* Python		3.6.2
* debug_toolbar	Debug Toolbar	1.11
* haystack	Haystack	0.42
* rest_framework	Django REST framework	3.9.1
* [所有库函数](https://github.com/syb666/mysite/blob/master/All_Library.md)
## 数据库
* Mysql 5.7
## 虚拟环境
* 安装虚拟环境pip install virtualenvwrapper
* 创建虚拟环境django-env
## 运行前配置
* MySQL 建立数据库 xfz,这里我会把表的信息上传到
* 通过pip添加需要的库函数
* 运行 python manage.py migrate 创建数据表
* 运行 python manage.py createsuperuser 创建管理员帐号
## 运行
### 调试
python manage.py runserver如果还有为安装的库，运行会出现报错，按照报错要求继续安装库函数</br>
通过 http://127.0.0.1:8000/
### 部署
* 设置 settings.py 中的 DEBUG 为 True
* 设置 settings.py 中的 ALLOWED_HOSTS，添加允许访问的 hosts
* [基于Win10的Django网站部署](https://blog.csdn.net/qq_32740675/article/details/80265849)
* 为 static 和 media 目录配置 Web 访问
* 配置好之后通过python manage.py runserver运行查看能否运行
* 在部署是有个问题没解决就是在我的服务器中没把项目放到虚拟环境中运行
* 还要注意端口问题
### 项目地址:www.sunyabo.cn
### 本人博客:https://blog.csdn.net/henusyb
