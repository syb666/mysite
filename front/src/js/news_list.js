function CMSNewsList() {

}
//监听时间选择器
CMSNewsList.prototype.listenDatePickerEvent = function(){
    var startPicker = $('#start-picker');
    var endPicker = $('#end-picker');
    var todayDate = new Date();
    var todayStr = todayDate.getFullYear()+"/"+todayDate.getMonth()+"/"+todayDate.getDay();
    var options = {
        'showButtonPanel': true,
        'format': 'yyyy/mm/dd',
        'startDate': '1000/6/1',
        'endDate': todayStr,
        'language': 'zh-CN',
        'todayBtn': 'linked',
        'todayHighlight': true,
        'clearBtn': true,
        'autoclose': true
    };
    startPicker.datepicker(options);
    endPicker.datepicker(options);
};


//未完成
CMSNewsList.prototype.remove = function(){
    var selectorRemove = $('.selector-remove');
    var startInput = $("input[name='start']");
    var endInput = $("input[name='end']");
    var title = $("input[name='title']");
    var category = $("input[name='category']");
    selectorRemove.click(function () {
        console.log("===============");
        startInput.val("");
        endInput.val("");
        title.val("");
        category.val("");
    });
};

CMSNewsList.prototype.listenDeleteEvent = function(){
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
        var dataId = deleteBtn.attr('data-news-id');
        console.log(dataId);
         xfzalert.alertConfirm({
            'title':'您确定删除这篇新闻嘛',
            'confirmCallback':function () {
                xfzajax.post({
                    'url':'/cms/delete_news/',
                    'data':{
                        'news_id':dataId
                    },
                    'success':function (result) {
                        if(result['code']===200){
                            // window.location.reload();//存在兼容性
                            window.location = window.location.href
                        }else{
                            xfzalert.close();
                        }
                    }
                })
            }
        })

        // xfzajax.post({
        //     'url':'/cms/delete_news/',
        //     'data':{
        //         'news_id':dataId
        //     },
        //     'success':function (result) {
        //         if(result['code']===200){
        //             console.log("-----------------");
        //              xfzalert.alertSuccess("恭喜！新闻编辑成功",function () {
        //                  window.location.reload();
        //              });
        //         }
        //     }
        // })
    });
};


CMSNewsList.prototype.run = function () {
    var self = this;
    self.listenDatePickerEvent();
    self.remove();
    self.listenDeleteEvent();
};



$(function () {
    var newsList = new CMSNewsList();
    newsList.run();

});