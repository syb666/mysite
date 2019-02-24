# -*- coding: utf-8 -*-
from haystack import indexes
from .models import News
class NewsIndex(indexes.SearchIndex,indexes.Indexable):
    #这里必须命名为text，否则还得再setting中修改
    text = indexes.CharField(document=True,use_template=True)

    #这个索引为那个模型服务的
    def get_model(self):
        return News

    def index_queryset(self, using=None):
        return self.get_model().objects.all()