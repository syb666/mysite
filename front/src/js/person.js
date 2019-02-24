function Person() {

}

Person.prototype.run = function () {
    var self = this;
    self.listenSavePersonInfoEvent();
};


Person.prototype.listenSavePersonInfoEvent = function(){
    var submitBtn = $('#submit-btn');
    var usernameInput = $("input[name='username']");
    var telephoneInput = $("input[name='telephone']");
    var emailInput = $("input[name='email']");
    submitBtn.click(function () {
        var username = usernameInput.val();
        var telephone = telephoneInput.val();
        var email = emailInput.val();
        var uid = submitBtn.attr('data-auth');
        // console.log(username);
        // console.log(telephone);
        // console.log(email);
        // console.log(uid);
        xfzajax.post({
            'url':'/account/save_person/',
            'data':{
                'username':username,
                'telephone':telephone,
                'email':email,
                'uid':uid,
            },
            'success':function (result) {
                if(result['code']===200){
                    xfzalert.alertSuccess("修改成功成功",function () {
                            console.log("=====================");
                            window.location.reload();
                    });
                }
            }
        })
    });
};

$(function () {
    var person = new Person();
    person.run();
});