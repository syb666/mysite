from django.shortcuts import render
from .models import NewsCategory,News,Comment,Banner
from django.conf import settings
from .serializers import NewSerializer,CommentSerizlizer
from utils import restful
from django.http import Http404
from .forms import PublicCommentForm
from apps.xfzauth.decorators import xfz_login_required
from django.db.models import Q
# Create your views here.

def index(request):
    count = settings.ONE_PAGE_NEWS_COUNT
    categorys = NewsCategory.objects.all()
    news = News.objects.select_related('category','author')[0:count]
    context = {
        'categorys':categorys,
        'news':news,
        'banners':Banner.objects.all()
    }
    return render(request,'news/index.html',context=context)

#处理新闻列表
def new_list(request):
    #默认是从第一页开始
    # 通过p参数，来指定要获取第几页的数据
    # 并且这个p参数，是通过查询字符串的方式传过来的/news/list/?p=2
    page = int(request.GET.get('p',1))
    #category_id=0是不进行任何分类
    category_id = int(request.GET.get('category_id',0))
    #计算起始和结束的值
    start = (page-1)*settings.ONE_PAGE_NEWS_COUNT
    end = start+settings.ONE_PAGE_NEWS_COUNT
    # {'id':1,'title':'abc',category:{"id":1,'name':'热点'}}
    if category_id==0:
        newses = News.objects.select_related('category','author').all()[start:end]
    else:
        newses = News.objects.select_related('category','author').filter(category_id=category_id)[start:end]
        #下面的many是代表很多都需要序列化
    serializer = NewSerializer(newses,many=True)
    data = serializer.data
    return restful.result(data=data)
def news_detail(request,news_id):
    try:
        #prefetch_related('comments__author')会执行俩次请求，首先是查找comments然后找到comments的author，执行俩次操作
        news = News.objects.select_related('category','author').prefetch_related('comments__author').get(pk=news_id)
        context = {
            'news':news,
        }
        return render(request,'news/news_detail.html',context=context)
    except News.DoesNotExist:
        raise Http404

@xfz_login_required
def public_comment(request):
    form = PublicCommentForm(request.POST)
    if form.is_valid():
        news_id = form.cleaned_data.get('news_id')
        content = form.cleaned_data.get('content')
        news = News.objects.get(pk=news_id)
        comment = Comment.objects.create(content=content,news=news,author=request.user)
        serizlize = CommentSerizlizer(comment)
        return restful.result(data=serizlize.data)
    else:
        return restful.params_error(message=form.get_errors())
def search(request):
    con = request.GET.get('q')
    context = {}
    if con:
        newses = News.objects.filter(Q(title__icontains=con)|Q(desc__icontains=con))
        context['newses'] = newses
        # print("=================")
    return render(request,'search/search1.html',context=context)