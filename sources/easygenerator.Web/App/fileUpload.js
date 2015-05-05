define(['notify', 'localization/localizationManager'], function (notify) {

    return {
        upload: function (options) {
            var defaults = {
                action: '',
                supportedExtensions: [],
                notSupportedFileMessage: 'This file format is not supported.',
                acceptedTypes: '*',

                startLoading: function () { },
                success: function () { },
                error: function () { },
                complete: function () { }
            };

            var settings = $.extend({}, defaults, options);

            var form = $("<form>")
                .hide()
                .attr('method', 'post')
                .attr('enctype', 'multipart/form-data')
                .attr('action', settings.action)
                .insertAfter("body");

            var input = $("<input>")
                .attr('accept', settings.acceptedTypes)
                .attr('type', 'file')
                .attr('name', 'file')
                .on('change', function () {
                    if ($(this).val().toLowerCase().match(new RegExp('\.(' + getSupportedExtensionsRegexBody(settings.supportedExtensions) + ')$'))) {
                        $(this).closest('form').ajaxSubmit({
                            global: false,
                            beforeSubmit: function () {
                                settings.startLoading();
                            },
                            success: function (response) {
                                try {
                                    settings.success(response);
                                } catch (e) {
                                    settings.error();
                                }

                                form.remove();
                                settings.complete();
                            },
                            error: function (event) {
                                settings.error(event);
                                form.remove();

                                settings.complete();
                            }
                        });
                    } else {
                        notify.error(settings.notSupportedFileMessage);
                    }
                })
                .appendTo(form);

            input.click();

            function getSupportedExtensionsRegexBody(extensions) {
                var result = '';
                for (var i = 0; i < extensions.length; i++) {
                    result += extensions[i];
                    if (i < extensions.length - 1)
                        result += '|';
                }

                return result;
            }

        }
    };
});