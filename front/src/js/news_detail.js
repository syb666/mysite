
function NewsList() {

}

NewsList.prototype.run = function(){
    var self = this;
    self.listenSubmetEvent();
    template.defaults.imports.timeSince = function (dateValue) {
        var date = new Date(dateValue);
        var datets = date.getTime();//获取创建时间
        var currentDate = (new Date()).getTime();//当前时间
        var timedely = parseInt((currentDate-datets)/1000);
        if (timedely<60)
            return "刚刚";
        else if(timedely>=60 && timedely<60*60){
            m = parseInt(timedely/60);
            return m+"分钟前";
        }else if(timedely>=60*60 && timedely<60*60*24){
            m = parseInt(timedely/(60*60));
            return m+"小时前";
        }else if(timedely>=60*60*24 && timedely<=60*60*24*30){
            m = parseInt(timedely/(60*60*24));
            return "%d天前"%m
        }
        else{
            var year = timedely.getFullYear();
            var month = timedely.getMonth();
            var day = timedely.getDay();
            var hour = timedely.getHours();
            var minute = timedely.getMinutes();
            var second = timedely.getSeconds();
            return year+"年"+month+"月"+day+"日"+hour+":"+minute+":"+second;
        }
    };
};

NewsList.prototype.listenSubmetEvent = function(){
    var submitBtn = $('.submit-btn');
    var textarea = $("textarea[name='comment']");
    submitBtn.click(function () {
        var content = textarea.val();
        var news_id = submitBtn.attr('data-news-id');
        xfzajax.post({
            'url': '/news/public_comment/',
            'data':{
                'content': content,
                'news_id': news_id
            },
            'success': function (result) {
                console.log(result);
                if(result['code'] === 200){
                    var comment = result['data'];
                    var tpl = template('comment-item',{"comment":comment});
                    var commentListGroup = $(".comment-list");
                    commentListGroup.prepend(tpl);
                    console.log(commentListGroup.length);
                    window.messageBox.showSuccess('评论发表成功！');
                    textarea.val("");
                }else{
                    window.messageBox.showError(result['message']);
                }
            }
        });
    });
};

$(function () {
    var newsList = new NewsList();
    newsList.run();
});