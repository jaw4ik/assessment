define(['notify', 'localization/localizationManager'], function (notify, localizationManager) {

    return {
        upload: function (options) {

            var defaults = {
                startLoading: function () { },
                success: function () { },
                error: function () { },
                complete: function () { }
            }

            var settings = $.extend({}, defaults, options);

            var form = $("<form>")
                      .hide()
                      .attr('method', 'post')
                      .attr('enctype', 'multipart/form-data')
                      .attr('action', '/storage/image/upload')
                      .insertAfter("body");

            var input = $("<input>")
               //.attr('accept', 'image/jpeg, image/gif, image/png, image/bmp')
               .attr('type', 'file')
               .attr('name', 'file')
               .on('change', function () {
                   if ($(this).val().toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp)$/)) {
                       $(this).closest('form').ajaxSubmit({
                           global: false,
                           beforeSubmit: function () {
                               settings.startLoading();
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

                               settings.complete();
                           },
                           error: function (event) {
                               var resourceKey = "responseFailed";

                               if (event && event.status) {
                                   switch (event.status) {
                                       case 400:
                                           resourceKey = "imageUploadError";
                                           break;
                                       case 413:
                                           resourceKey = "imageSizeIsTooLarge";
                                           break;
                                   }
                               }

                               notify.error(localizationManager.localize(resourceKey));

                               settings.error();
                               form.remove();

                               settings.complete();
                           }
                       });
                   } else {
                       notify.error(localizationManager.localize('imageIsNotSupported'));
                   }
               })
               .appendTo(form);

            input.click();
        }
    }

})