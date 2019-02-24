// 面向对象
// 1. 添加属性
// 通过this关键字，绑定属性，并且指定他的值。
// 原型链
// 2. 添加方法
// 在Banner.prototype上绑定方法就可以了。
// @import("../../dist/js/jquery-3.3.1.min.js")
// function Banner() {
//     // 这个里面写的代码
//     // 相当于是Python中的__init__方法的代码
//     console.log('构造函数');
//     this.person = 'zhiliao';
// }
//
// Banner.prototype.greet = function (word) {
//     console.log('hello ',word);
// };
//
// var banner = new Banner();
// console.log(banner.person);
// banner.greet('zhiliao');





function Banner() {
    this.pageControl=$(".page-control");
    this.bannerWidth=798;
    this.bannerGroup = $("#banner-group");
    this.index=1;
    this.leftArrow=$(".left-arrow");
    this.rightArrow=$(".right-arrow");//这里不要写#号
    this.bannerUl=$("#banner-ul");
    this.liList = this.bannerUl.children("li");
    this.bannerCount = this.liList.length;
    this.listenBannerHover();

}

Banner.prototype.initBanner=function(){
    var self=this;
    self.bannerUl.css({"Width":self.bannerWidth*self.bannerCount});
    var firstBanner = self.liList.eq(0).clone();
    var lastBanner = self.liList.eq(self.bannerCount-1).clone();
    self.bannerUl.append(firstBanner);
    self.bannerUl.prepend(lastBanner);
    self.bannerUl.css({"width":(self.bannerCount+2)*self.bannerWidth,"left":-self.bannerWidth});

};

Banner.prototype.initPageControl=function(){
    var self = this;
    //var pageControl = $(".page-control");

    for(var i=0;i<self.bannerCount;i++){
        var circle = $("<li></li>");//创建一个li标签
        self.pageControl.append(circle);
        if(i===0){
            circle.addClass("active");
        }
    }
    self.pageControl.css({"width":self.bannerCount*12+8*2+16*(self.bannerCount-1)});
    self.bannerUl.css({"width":self.bannerCount*this.bannerWidth});
};

Banner.prototype.toggleArrow=function(isShow){
    var self = this;
      if(isShow){
          self.leftArrow.show();
          self.rightArrow.show();
      }else{
          self.leftArrow.hide();
          self.rightArrow.hide();
      }
};



Banner.prototype.animate = function(){
    var self = this;
    self.bannerUl.stop().animate({"left":-798*self.index},500);
    var index = self.index;
    if(index===0){
        index=self.bannerCount-1;
    }else if(index===self.bannerCount+1){
        index=0;
    }else{
        index=self.index-1;
    }
    self.pageControl.children("li").eq(index).addClass("active").siblings().removeClass("active");
    //eq是代表获取到的第几个li标签
};


Banner.prototype.loop = function(){
    var self = this;

    this.timer = setInterval(function () {
        if(self.index>=self.bannerCount+1){
            self.bannerUl.css({"left":-self.bannerWidth});
            self.index=2;
        }else{
            self.index++;
        }
        self.animate();
    },1000);
};

Banner.prototype.listenArrowClick=function(){
    var self = this;
    self.leftArrow.click(function () {
       if(self.index===0){
           self.bannerUl.css({"left":-self.bannerWidth*(self.bannerCount)});
           self.index=self.bannerCount-1;
       }else{
            self.index--;
        }

       self.animate();
    });
    self.rightArrow.click(function () {
       if(self.index===self.bannerCount+1){
           self.bannerUl.css({"left":-self.bannerWidth});
           self.index=2;
       }else{
           self.index++;
        }
       self.animate();
    });
};

Banner.prototype.listenBannerHover=function(){
    var self = this;//这里的this是上面的Banner
    this.bannerGroup.hover(function () {
        clearInterval(self.timer);
        self.toggleArrow(true);
          //第一个函数是，把鼠标移动到banner上会执行的函数
      },function () {
        self.loop();
        self.toggleArrow(false);
          //第二个函数是，吧鼠标从banner上移走会执行的函数
      });
};

Banner.prototype.listPageControl=function(){
    var self = this;
    self.pageControl.children("li").each(function (index,obj) {
        $(obj).click(function () {
            self.index=index+1;
            console.log(index);//测试
            self.animate();
            //必须称为jQ对象才能使用.click方法
            //因为每次执行animate时都得执行如下代码，所以可以放到animate方法中
            //$(obj).addClass("active").siblings().removeClass("active");
        });

    });
};

Banner.prototype.run=function () {
    this.loop();
    this.listenArrowClick();
    this.initPageControl();
    this.initBanner();
    this.listPageControl()
    // console.log(this.bannerCount);
    // clearInterval(timer);//关闭定时器
};



function Index(){
    var self = this;
    self.page = 2;
    self.category_id = 0;

}



Index.prototype.listenLoadMoreEvent = function(){
    var self = this;
    var loadMoreBtn = $('#load-more-btn');
    loadMoreBtn.click(function () {
        //从第二页开始

        xfzajax.get({
            'url':'/news/list/',
            'data':{
                'p': self.page,
                'category_id':self.category_id
            },
            'success':function (result) {
                if(result['code']===200){
                    var newses = result['data'];
                    if (newses.length>0){
                        var tpl = template("news_item",{"newses":newses});
                        var ul = $('.list-inner-group');
                        ul.append(tpl);
                        self.page+=1;
                    }else{
                        loadMoreBtn.hide();
                    }
                }
            }
        })
    })
};

Index.prototype.listenCategorySwitchEvent = function(){
    var self = this;
    var tabGroup = $('.list-tab');
    tabGroup.children().click(function () {
        var li = $(this);
        var category_id = li.attr('data-category');
        var page = 1;
        console.log(category_id);
        // li.addClass('active');
        xfzajax.get({
            'url':'/news/list/',
            'data':{
                'category_id':category_id,
                'p':page
            },
            'success':function (result) {
                if(result['code']===200){
                    console.log(result['data']);
                    var newses = result['data'];
                    var tpl = template("news_item",{"newses":newses});
                    var listInnerGroup = $('.list-inner-group');
                    listInnerGroup.empty();
                    listInnerGroup.append(tpl);
                    self.page = 2;
                    self.category_id = category_id;
                    li.addClass('active').siblings().removeClass('active');
                    var loadMore = $('.load-more');
                    loadMore.show();
                }
            }
        })
    });
};

Index.prototype.run = function(){
    var self = this;
    self.listenLoadMoreEvent();
    self.listenCategorySwitchEvent();

};

// 文件加载完毕后执行
$(function () {
    var banner = new Banner();
    banner.run();

    var index = new Index();
    index.run();


});