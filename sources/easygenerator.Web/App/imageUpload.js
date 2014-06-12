define([], function () {

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
                      .attr('action', 'http://localhost:666/storage/image/upload')
                      .insertAfter("body");

            var input = $("<input>")
               .attr('type', 'file')
               .attr('name', 'file')
               .on('change', function () {
                   $(this).closest('form').ajaxSubmit({
                       beforeSubmit: function () {
                           //settings.beginUpload();
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
                       },
                       error: function () {
                           settings.error();
                           form.remove();
                       }
                   });
               })
               .appendTo(form);

            input.click();
        }
    }

})