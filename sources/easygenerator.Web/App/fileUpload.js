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
                            headers: window.auth.getHeader('api'),
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

        },
        xhr2: function (url, file, headers) {
            var dfd = Q.defer();

            var xhr = new XMLHttpRequest();
            xhr.addEventListener('error', error);
            xhr.addEventListener('progress', progress, false);

            if (xhr.upload) {
                xhr.upload.onprogress = progress;
            }
            xhr.onreadystatechange = function (e) {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        try {
                            success(JSON.parse(this.response));
                        } catch (err) {
                            error(err);
                        }
                    } else {
                        error(e);
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.responseType = 'text';

            if (headers) {
                for (var header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, headers[header]);
                    }
                }
            }


            var formData = new FormData();
            formData.append('file', file);
            xhr.send(formData);

            function error() {
                dfd.reject();
            }

            function success(obj) {
                dfd.resolve(obj);
            }

            function progress(e) {
                if (e.total > 0) {
                    dfd.notify(Math.floor((e.loaded / e.total) * 100));
                }
            }

            return dfd.promise;
        }
    };
});