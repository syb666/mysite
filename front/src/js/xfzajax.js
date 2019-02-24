/**
 * Created by hynev on 2018/5/15.
 */

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var xfzajax = {
    'get': function (args) {
        args['method'] = 'get';
        this.ajax(args);
    },
    'post': function (args) {
        args['method'] = 'post';
        this._ajaxSetup();
        this.ajax(args);
    },
    'ajax': function (args) {
        var success = args['success'];
        args['success'] = function(result){
            if(result['code']===200){
                if(success){
                    success(result);
                }
            }else{
                var messageObject = result['message'];
                //判断是普通字符串还是
                if(typeof messageObject == 'string' || messageObject.constructor == String){
                    //将错误信息传到页面

                    window.messageBox.showError(messageObject);
                    //  console.log(messageObject);
                }else{
                    // {"password":['密码最大长度不能超过20为！','xxx'],"telephone":['xx','x']}
                    for(var key in messageObject){
                        var messages = messageObject[key];
                        var message = messages[0];
                        // console.log(message);
                        window.messageBox.showError(message);
                    }
                }
                if(success){
                    success(result);
                }
            }
        };
        args['fail'] = function(error){
            console.log(error);
            window.location.showError("服务器内部错误");
        };
        $.ajax(args);
    },
    '_ajaxSetup': function () {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));

                }
            }
        });
    }
};