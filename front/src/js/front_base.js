
// 用来处理导航条的
function FrontBase() {}


FrontBase.prototype.run = function () {
    var self = this;
    self.listenAuthBoxHover();
};

FrontBase.prototype.listenAuthBoxHover = function () {
    var authBox = $(".auth-box");
    var userMoreBox = $(".user-more-box");
    authBox.hover(function () {
        userMoreBox.show();
    },function () {
        userMoreBox.hide();
    });
};

$(function () {
    var frontBase = new FrontBase();
    frontBase.run();
});


//处理登录和注册
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
    self.listenImgCaptchaEvent();
    self.listenSmsCaptchaEvent();
    self.listenSignupEvent();


};
Auth.prototype.showEvent = function(){
    var self = this;
    self.maskWrapper.show();
};


Auth.prototype.hideEvent = function(){
    var self = this;
    self.maskWrapper.hide();
};

//监听验证码图片
Auth.prototype.listenImgCaptchaEvent = function(){
    var ImgCaptcha = $('.img-captcha');
    ImgCaptcha.click(function () {
        //每次请求的不一样时会自动的刷新
       ImgCaptcha.attr("src","/account/img_captcha/"+"?random="+Math.random())
    });

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

//监听短信验证码
Auth.prototype.smsSuccessEven = function(){
    var self = this;
    var smsCaptchaBtn = $('.sms-captcha-btn');
    window.messageBox.showSuccess("短信发送成功");
    smsCaptchaBtn.addClass("disable");
    var count = 60;
    //关闭点击事件
    smsCaptchaBtn.unbind("click");
    var timer = setInterval(function () {
       smsCaptchaBtn.text(count+"s");
       count--;
       if(count<=0){
           clearInterval(timer);
           smsCaptchaBtn.removeClass('disable');
           smsCaptchaBtn.text("发送验证码");
           //执行完后重新开启listenSmsCaptchaEvent方法
           self.listenSmsCaptchaEvent();
       }
    },1000);
};


Auth.prototype.listenSmsCaptchaEvent = function(){
    var self = this;
    var smsCaptchaBtn = $('.sms-captcha-btn');
    //获取输入框
    var telephoneInput = $(".signup-group input[name='telephone']");//这里不能直接获取input标签因为，还有注册时也有个input标签，容易混合
    smsCaptchaBtn.click(function () {
        telephone = telephoneInput.val();
        if(!telephone){
            window.messageBox.showError("请输入手机号")
        }else{
            xfzajax.get({
               'url':'/account/sms_captcha/',
               'data':{
                   "telephone":telephone
               },
               'success':function (result) {
                   // window.messageBox.showSuccess("短信发送成功");
                   self.smsSuccessEven();
                   // console.log("==================");
                   // if(result['code'] === 200){
                   //
                   // }
               },
               'fail':function (error) {
                   console.log(error);
               }
            });
        }
    });
};

//监听登录时的ajax请求
Auth.prototype.listenSigninEvent = function(){
    var self = this;
    //必须先获取所在的signin然后再获取下面的输入框,因为登录时的signup中也有下面几个输入框
    var signinGroup = $('.signin-group');
    //获取登录时的三个对话框
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");

    var submitBtn = $('.submit-btn');
    // console.log(submitBtn.length);
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
                self.hideEvent();
                window.location.reload();
            },
        });

    });

};

Auth.prototype.listenSignupEvent = function(){
    var self = this;
    var signupGroup = $('.signup-group');
    var submitBtn = $('.submit-btn');
    // console.log(submitBtn.length);
    var telephoneInput = signupGroup.find("input[name='telephone']");
    var usernameInput = signupGroup.find("input[name='username']");
    var imgCaptchaInput = signupGroup.find("input[name='img_captcha']");
    var password1Input = signupGroup.find("input[name='password1']");
    var password2Input = signupGroup.find("input[name='password2']");
    var smsCaptchaInput = signupGroup.find("input[name='sms_captcha']");
    submitBtn.click(function (event) {
        // event.preventDefault();
        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var img_captcha = imgCaptchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var sms_captcha = smsCaptchaInput.val();
        console.log(telephone);
        console.log(username);
        console.log(img_captcha);
        console.log(password1);
        console.log(password2);
        console.log(sms_captcha);
        xfzajax.post({
            'url':'/account/register/',
            'data':{
                'telephone':telephone,
                'username':username,
                'img_captcha':img_captcha,
                'password1':password1,
                'password2':password2,
                'sms_captcha':sms_captcha,
            },
            'success':function (result) {
                window.location.reload();
            },

        })
    });

};


$(function () {
    var auth = new Auth();
    auth.run();
});






$(function () {
    if(window.template){
        template.defaults.imports.timeSince = function (dateValue) {
            var date = new Date(dateValue);
            var datets = date.getTime(); // 得到的是毫秒的
            var nowts = (new Date()).getTime(); //得到的是当前时间的时间戳
            var timestamp = (nowts - datets)/1000; // 除以1000，得到的是秒
            if(timestamp < 60) {
                return '刚刚';
            }
            else if(timestamp >= 60 && timestamp < 60*60) {
                minutes = parseInt(timestamp / 60);
                return minutes+'分钟前';
            }
            else if(timestamp >= 60*60 && timestamp < 60*60*24) {
                hours = parseInt(timestamp / 60 / 60);
                return hours+'小时前';
            }
            else if(timestamp >= 60*60*24 && timestamp < 60*60*24*30) {
                days = parseInt(timestamp / 60 / 60 / 24);
                return days + '天前';
            }else{
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDay();
                var hour = date.getHours();
                var minute = date.getMinutes();
                return year+'/'+month+'/'+day+" "+hour+":"+minute;
            }
        }
    }
});