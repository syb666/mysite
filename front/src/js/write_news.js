function News() {
    this.progressGroup = $("#progress-group");
}


//上传到本地
News.prototype.listenUploadCategoryEvent=function(){
   var uploadBtn = $('#thumbnail-btn');
    uploadBtn.change(function () {
        var file = uploadBtn[0].files[0];
        var formData = new FormData();
        formData.append('file',file);
        xfzajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if(result['code'] === 200){

                    var url = result['data']['url'];
                    var thumbnailInput = $("#thumbnail-form");
                    thumbnailInput.val(url);
                    console.log("===================");
                    console.log(url);
                    console.log("===================");
                }
            }

        });
    });
};

//上传到七牛云
// News.prototype.listenQiniuUploadFileEvent = function(){
//     var self = this;
//     var uploadBtn = $('#thumbnail-btn');
//     uploadBtn.change(function () {
//         var file = this.files[0];
//         xfzajax.get({
//             'url': '/cms/qntoken/',
//             'success': function (result) {
//                 if(result['code'] === 200){
//                     var token = result['data']['token'];
//                     // a.b.jpg = ['a','b','jpg']
//                     // 198888888 + . + jpg = 1988888.jpg
//                     var key = (new Date()).getTime() + '.' + file.name.split('.')[1];
//                     //额外的信息
//                     var putExtra = {
//                         fname: key,
//                         params:{},
//                         mimeType: ['image/png','image/jpeg','image/gif','video/x-ms-wmv','video/mp4']//限制上传文件类型
//                     };
//                     //配置信息
//                     var config = {
//                         useCdnDomain: true,//是否加速
//                         retryCount: 6,//重复的次数
//                         region: qiniu.region.z0//上传到那个空间，一定不能错
//                     };
//                     var observable = qiniu.upload(file,key,token,putExtra,config);
//                     //发送上传文件的信息
//                     observable.subscribe({
//                         //上传10%。。。20%
//                         'next': self.handleFileUploadProgress,
//                         //出现错误
//                         'error': self.handleFileUploadError,
//                         'complete': self.handleFileUploadComplete
//                     });
//                 }
//             }
//         });
//     });
// };

News.prototype.handleFileUploadProgress = function (response) {
    var total = response.total;
    var percent = total.percent;
    var percentText = percent.toFixed(0)+'%';
    // 24.0909，89.000....
    var progressGroup = News.progressGroup;
    progressGroup.show();
    var progressBar = $(".progress-bar");
    progressBar.css({"width":percentText});
    progressBar.text(percentText);
};

News.prototype.handleFileUploadError = function (error) {
    window.messageBox.showError(error.message);
    var progressGroup = $("#progress-group");
    progressGroup.hide();
    console.log(error.message);
};

News.prototype.handleFileUploadComplete = function (response) {
    console.log(response);
    var progressGroup = $("#progress-group");
    progressGroup.hide();

    var domain = 'http://127.0.0.1:8000/';
    var filename = response.key;
    var url = domain + filename;
    var thumbnailInput = $("input[name='thumbnail']");
    thumbnailInput.val(url);
};


//初始编辑器
News.prototype.initUEditor = function(){
    window.ue = UE.getEditor('editor',{
        'initialFrameHeight':400,//设置高度
        'serverUrl':'/ueditor/upload/'//必须配置，否者不能上传图片，视频
    });
};

News.prototype.listenPostEvent = function(){
    var submitBtn = $('#submit-btn');
    submitBtn.click(function (event) {
        //关闭submit，
        // console.log("1`1111111111111111");
        event.preventDefault();
        var btn = $(this);
        var pk = btn.attr('data-news-id');

        var title = $("input[name='title']").val();
        var category = $("select[name='category']").val();
        var desc = $("input[name='desc']").val();
        var thumbnail = $("input[name='thumbnail']").val();
        var content = window.ue.getContent();
        // console.log(pk);
        // console.log(thumbnail);
        // console.log(category);
        // console.log(desc);
        // console.log(title);
        // console.log(content);
        var url = '';
        if(pk){
            url = '/cms/EditNewsView/';
        }else{
            // console.log("==========");
            url = '/cms/Writer_news/';
        }

        xfzajax.post({
            'url':url,
            'data':{
                'title':title,
                'category':category,
                'desc':desc,
                'thumbnail':thumbnail,
                'content':content,
                'pk':pk
            },
            'success':function (result) {
                if(result['code']===200){
                    //第二个参数是点击确定按钮后要执行的
                    if(pk){
                        xfzalert.alertSuccess("恭喜！新闻编辑成功",function () {
                            window.location.reload();
                        });
                    }else{
                        xfzalert.alertSuccess("恭喜！新闻发布成功",function () {
                            window.location.reload();
                        });
                    }

                }
            }
        });

    });
};




News.prototype.run = function () {
   var self = this;
   self.listenUploadCategoryEvent();
   // self.listenQiniuUploadFileEvent();
   self.listenPostEvent();
   self.initUEditor();
};

$(function () {
   var news = new News();
   news.run();
   News.progressGroup = $('#progress-group');
});