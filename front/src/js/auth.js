function Auth() {
    var self = this;
    self.maskWrapper = $('.mask-wrapper');//获取登录的那个页面
    self.scrollWrapper = $(".scroll-wrapper");//获取登录/注册那俩框
}
Auth.prototype.run = function () {//要执行的方法
    var self = this;
    self.listenShowHideEvent();
    self.listenSwitchEvent();
    self.listenSigninEvent();
};
Auth.prototype.showEvent = function(){
    var self = this;
    self.maskWrapper.show();
};


Auth.prototype.hideEvent = function(){
    var self = this;
    self.maskWrapper.hide();
};

//监听showEvent和hideEvent这俩方法
Auth.prototype.listenShowHideEvent = function(){
    var self = this;
    var signinBtn = $('.signin-btn');
    var signupBtn = $(".signup-btn");
    var closeBtn = $('.close-btn');
    var scrollWrapper = $('.scroll-wrapper');
    signinBtn.click(function () {
       self.showEvent();
       self.scrollWrapper.css({"left":0});
    });
    signupBtn.click(function () {
       self.showEvent();
       self.scrollWrapper.css({"left":-400});
    });
    closeBtn.click(function () {
        self.hideEvent();
    });
};

//监听
Auth.prototype.listenSwitchEvent = function(){
    var self = this;
    var switch1 = $('.switch');
    switch1.click(function () {
        var currentLeft = self.scrollWrapper.css("left");
        currentLeft = parseInt(currentLeft);
        if(currentLeft < 0){
            //对scrollWrapper添加属性left值为0
            //animate和css有一定区别
            self.scrollWrapper.animate({"left":'0'});
        }else{
            self.scrollWrapper.animate({"left":"-400px"});
        }
    });
};

Auth.prototype.listenSigninEvent = function(){
    var self = this;
    var signinGroup = $('.signin-group');
    //获取登录时的三个对话框
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");

    var submitBtn = $('.submit-btn');

    submitBtn.click(function () {
        //当点击‘立即登录’时获取输入框的内容
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop("checked");//获取勾选框
        xfzajax.post({
            'url':'/account/login/',
            'data':{
                'telephone':telephone,
                'password':password,
                'remember':remember?1:0
            },
            'success':function (result) {

                if(result['code']===200){
                    self.hideEvent();
                    //重新加载页面
                    window.location.reload();
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
            },
            'fail':function (error) {
                console.log(error);
            }

        });

    });



};

//整个网页加载完后执行
$(function () {
    var auth = new Auth();
    auth.run();
});