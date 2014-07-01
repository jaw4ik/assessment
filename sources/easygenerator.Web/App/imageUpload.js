define(['uiLocker'], function (uiLocker) {

    return {
        upload: function (options) {

            var defaults = {
                success: function () { },
                error: function () { }
            }

            var settings = $.extend({}, defaults, options);

            var form = $("<form>")
                      .hide()
                      .attr('method', 'post')
                      .attr('enctype', 'multipart/form-data')
                      .attr('action', '/storage/image/upload')
                      .insertAfter("body");

            var input = $("<input>")
               .attr('type', 'file')
               .attr('name', 'file')
               .on('change', function () {
                   $(this).closest('form').ajaxSubmit({
                       beforeSubmit: function () {
                           //settings.beginUpload();
                           uiLocker.lock();
                       },
                       success: function (response) {
                           try {
                               var obj = JSON.parse(response);
                               if (obj && obj.data && obj.data.url) {
                                   settings.success(obj.data.url);
                               } else {
                                   settings.error();
                               }
                           } catch (e) {
                               settings.error();
                           }
                           form.remove();
                           uiLocker.unlock();
                       },
                       error: function () {
                           settings.error();
                           form.remove();
                           uiLocker.unlock();
                       }
                   });
               })
               .appendTo(form);

            input.click();
        }
    }

})