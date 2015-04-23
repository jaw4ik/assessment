(function () {
    "use strict";

    angular.module('design', [])
        .controller('DesignController', ['$scope', '$window', DesignController]);

    function DesignController($scope, $window) {
        var that = $scope,
            baseUrl = location.protocol + '//' + location.host,
            currentSettings = null;

        that.userAccess = (function () {
            var self = {};

            self.hasStarterPlan = true;
            self.init = init;

            return self;

            function init(userData) {
                self.hasStarterPlan = userData.accessType > 0;
            }
        })();

        that.logo = (function () {
            var self = {};
            self.url = '';

            self.hasError = false;
            self.errorText = 'Unsupported image format';
            self.errorDescription = '(Supported formats: jpg, png, bmp)';
            self.isLoading = false;

            self.hasLogo = hasLogo;
            self.clear = clear;

            self.init = init;

            return self;

            function hasLogo() {
                return self.url !== '';
            }

            function clear() {
                self.url = '';
            }

            function init(logoSettings) {
                self.url = '';
                if (logoSettings && logoSettings.url) {
                    self.url = logoSettings.url;
                }
            }
        })(),

        angular.element($window).on('blur', saveChanges);

        function saveChanges() {
            var newSettings = getCurrentSettings();

            if (angular.equals(currentSettings, newSettings)) {
                return;
            }

            window.egApi.saveSettings(JSON.stringify(newSettings), null).done(function () {
                currentSettings = newSettings;
            });
        };

        function getCurrentSettings(settings) {
            return $.extend({}, settings || currentSettings, {
                logo: {
                    url: that.logo.url
                }
            });
        }

        //#region Image uploader

        var imageUploader = {
            apiUrl: baseUrl + '/storage/image/upload',
            maxFileSize: 10, //MB
            supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
            somethingWentWrongMessage: {
                title: 'Something went wrong',
                description: 'Please, try again'
            },

            status: {
                default: function () {
                    that.logo.isLoading = false;
                    that.logo.hasError = false;
                    that.$apply();
                },
                fail: function (reason) {
                    that.logo.clear();
                    that.logo.isLoading = false;
                    that.logo.errorText = reason.title;
                    that.logo.errorDescription = reason.description;
                    that.logo.hasError = true;
                    that.$apply();
                },
                loading: function () {
                    that.logo.isLoading = true;
                    that.$apply();
                }
            },

            button: {
                enable: function () {
                    this.$input.attr('disabled', false).closest('.image-upload-button').removeClass('disabled');
                },
                disable: function () {
                    this.$input.attr('disabled', true).closest('.image-upload-button').addClass('disabled');
                },
                submit: function () {
                    this.$input[0].form.submit();
                    this.disable();
                    imageUploader.status.loading();
                },
                $input: $('#logoInput')
            },

            init: function () {
                imageUploader.button.$input.on('change', imageUploader.processFile);
                imageUploader.button.enable();
            },

            processFile: function () {
                if (!this.files) {
                    imageUploader.button.submit();
                    return;
                }
                if (this.files.length === 0) {
                    return;
                }

                var file = this.files[0],
                    fileExtension = file.name.split('.').pop().toLowerCase();

                if ($.inArray(fileExtension, imageUploader.supportedExtensions) === -1) {
                    imageUploader.status.fail({
                        title: 'Unsupported image format',
                        description: '(Allowed formats: ' + imageUploader.supportedExtensions.join(', ') + ')'
                    });
                    return;
                }
                if (file.size > imageUploader.maxFileSize * 1024 * 1024) {
                    imageUploader.status.fail({
                        title: 'File is too large',
                        description: '(Max file size: ' + imageUploader.maxFileSize + 'MB)'
                    });
                    return;
                }
                imageUploader.uploadFile(file);
            },

            uploadFile: function (file) {
                imageUploader.button.disable();
                imageUploader.status.loading();

                var formData = new FormData();
                formData.append('file', file);

                $.ajax({
                    url: imageUploader.apiUrl,
                    type: 'POST',
                    data: formData,
                    cache: false,
                    dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                }).done(function (response) {
                    imageUploader.handleResponse(response);
                }).fail(function () {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                    imageUploader.button.enable();
                });
            },

            handleResponse: function (response) {
                try {
                    if (!response) {
                        throw 'Response is empty';
                    }

                    if (typeof response !== 'object') {
                        response = JSON.parse(response);
                    }

                    if (!response || !response.success || !response.data) {
                        throw 'Request is not successful';
                    }

                    that.logo.url = response.data.url;
                    that.$apply();
                    imageUploader.status.default();
                } catch (e) {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                } finally {
                    imageUploader.button.enable();
                }
            }
        };

        //#endregion Image uploader

        //#region Initialization

        var api = window.egApi;
        return api.init().then(function () {
            var user = api.getUser(),
                settings = api.getSettings();

            that.userAccess.init(user);
            that.logo.init(settings.logo);

            if (that.userAccess.hasStarterPlan) {
                imageUploader.init();
            }

            currentSettings = getCurrentSettings(settings);
            that.$applyAsync();

        }).fail(function () {
            api.sendNotificationToEditor('Settings are not initialized.', false);
        });

        //#endregion Initialization
    }

})();