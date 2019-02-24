function NewsCategory() {

};

NewsCategory.prototype.run = function () {
    var self = this;
    self.listenAddCategoryEvent();
    self.listenEditCategoryEvent();
    self.listenDeleteCategoryEvent();
};

//监听添加分类
NewsCategory.prototype.listenAddCategoryEvent = function () {
    var addBtn = $('#add-btn');
    addBtn.click(function () {

        xfzalert.alertOneInput({
            'title': '添加新闻分类',
            'placeholder': '请输入新闻分类',
            'confirmCallback': function (inpuValue) {
                xfzajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {
                        'name': inpuValue
                    },
                    'success': function (result) {
                        if(result['code'] === 200){
                            console.log(result);
                            window.location.reload();
                        }else{
                            xfzalert.close();
                            // window.messageBox.showError(result['message']);
                        }
                    }
                });
            }
        });
    });
};
//监听编辑分类
NewsCategory.prototype.listenEditCategoryEvent = function(){
    var self = this;
    var editBtn = $('.edit-btn');
    editBtn.click(function () {
        var currentBtn = $(this);//获取当前的这个butten这个标签
        var tr = currentBtn.parent().parent();
        var pk = tr.attr("data-pk");
        var name = tr.attr("data-name");
        xfzalert.alertOneInput({
            'title':'修改分类名称',
            'placeholder':'请输入新的分类名称',
            'value':name,
            'confirmCallback':function (inputValue) {
                xfzajax.post({
                    'url':'/cms/edit_news_category/',
                    'data':{
                        'pk':pk,
                        'name':inputValue
                    },
                    'success':function (result) {
                        if(result['code']===200){
                            window.location.reload();
                        }else{
                            xfzalert.close();
                        }
                    }
                })
            }
        })
    });
};

//监听删除分类
NewsCategory.prototype.listenDeleteCategoryEvent=function(){
    var self = this;
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
        var current = $(this);
        var tr = current.parent().parent();
        var pk = tr.attr('data-pk');
        xfzalert.alertConfirm({
            'title':'您确定删除这个分类',
            'confirmCallback':function () {
                xfzajax.post({
                    'url':'/cms/delete_news_category/',
                    'data':{
                        'pk':pk
                    },
                    'success':function (result) {
                        if(result['code']===200){
                            window.location.reload();
                        }else{
                            xfzalert.close();
                        }
                    }
                })
            }
        })
    });
};
$(function () {
    var category = new NewsCategory();
    category.run();
});