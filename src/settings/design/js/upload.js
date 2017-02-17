(function () {
    "use strict";

    angular.module('design')
        .factory('upload', upload);

    function upload() {
        var url = getImageUploadUrl();
        var headers = { 'Authorization': '' };

        var somethingWentWrongMessage = {
            title: 'Something went wrong',
            description: 'Please, try again'
        };

        var settings = {
            maxFileSize: 10, //MB
            supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif']
        };

        return function (callback) {
            var deffered = $.Deferred();

            var form = $("<form>")
                .hide()
                .attr('method', 'post')
                .attr('enctype', 'multipart/form-data')
                .insertAfter("body");

            var input = $("<input>")
                .attr('accept', settings.supportedExtensions.map(function (e) {
                    return '.' + e;
                }).join(', '))
                .attr('type', 'file')
                .attr('name', 'file')
                .on('change', function () {
                    if (callback) {
                        callback();
                    }

                    var file = this.files[0];

                    var validationResult = validate(file);

                    if (validationResult !== true) {
                        deffered.reject(validationResult);
                        return;
                    }

                    var formData = new FormData();
                    formData.append('file', file);
                    setSettingsToken().then(function(){
                        $.ajax({
                            url: url,
                            type: 'POST',
                            headers: headers,
                            data: formData,
                            contentType: false,
                            processData: false
                        }).done(function (response) {
                            if (response) {
                                deffered.resolve(response.url);
                            } else {
                                deffered.reject(somethingWentWrongMessage);
                            }
                        }).fail(function (reason) {
                            deffered.reject(somethingWentWrongMessage);
                        });
                    });
                })
                .appendTo(form);

            input.click();

            return deffered.promise();

            function validate(file) {
                var extension = file.name.split('.').pop().toLowerCase();

                if ($.inArray(extension, settings.supportedExtensions) === -1) {
                    return {
                        title: 'Unsupported image format',
                        description: '(Allowed formats: ' + settings.supportedExtensions.join(', ') + ')'
                    };
                }
                if (file.size > settings.maxFileSize * 1024 * 1024) {
                    return {
                        title: 'File is too large',
                        description: '(Max file size: ' + settings.maxFileSize + 'MB)'
                    };
                }

                return true;
            }
        };

        function getSettingsToken() {
            var tokenDefer = $.Deferred();
            var localStorageProvider = window.parent.localStorageProvider;
            if (!localStorageProvider) {
                tokenDefer.resolve(localStorage['token.settings']);
            }
            localStorageProvider.getItem('token.settings').then(function(value) {
                tokenDefer.resolve(value);
            }).fail(function() {
                tokenDefer.resolve('');
            });
            return tokenDefer.promise();
        }

        function setSettingsToken(){
            var dfd = $.Deferred();
            if(headers.Authorization){
                dfd.resolve();
            } else {
                getSettingsToken().then(function(token){
                    headers.Authorization += 'Bearer ' + (getURLParameter('token') || token);
                    dfd.resolve();
                });
            }
            return dfd.promise();
        }
    }

    function getURLParameter(name) {
        var param = RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || null;
        return param === null ? null : decodeURI(param[1]);
    }

    function getImageUploadUrl(){
        var localhostUrl = location.protocol + '//localhost:222/image/upload';
        var stagingUrl = 'https://images-staging.easygenerator.com/image/upload';
        var liveUrl = 'https://images-staging.easygenerator.com/image/upload';
        if(location.host.indexOf('localhost') !== -1){
            return localhostUrl;
        }
        if(location.host.indexOf('live.easygenerator.com') !== -1){
            return liveUrl;
        }
        return stagingUrl;
    }

})();