function Staff() {

}
Staff.prototype.run = function () {
    var self = this;
    self.listenDeleteStaffEvent();
    self.listenEditStaffEvent();
};

//监听编辑员工
Staff.prototype.listenEditStaffEvent = function(){
    var editBtn = $('.edit-btn');
    editBtn.click(function () {
        var current = $(this);
        var tr = current.parent().parent().parent();
        var staffUid = tr.attr('data-staff');
        console.log(staffUid);
        if(staffUid){
            xfzajax.post({
                'url':'/cms/edit_staff/',
                'data':{
                    'staffUid':staffUid
                },
                'success':function (result) {
                     if(result['code']===200){
                         xfzalert.alertSuccess("编辑成功");
                     }
                }
            })
        }
    });

};

//监听删除员工
Staff.prototype.listenDeleteStaffEvent = function(){
    var deleteStaff = $('.delete-btn');
    deleteStaff.click(function () {
        // console.log("================");
        var current = $(this);
        var tr = current.parent().parent();
        var staffTelephone = tr.attr('data-staff-telephone');
        console.log(staffTelephone);
        if(staffTelephone){
            xfzalert.alertConfirm({
                'text':'您确定删除此用户',
                'confirmCallback':function () {
                    xfzajax.post({
                        'url':'/cms/deleteStaff/',
                        'data':{
                            'staffTelephone':staffTelephone
                        },
                        'success':function (result) {
                            if(result['code']===200){
                                window.location.reload()
                            }
                        }
                    })
                }
            })
        }

    });
};

$(function () {
    var staff = new Staff();
    staff.run();
});