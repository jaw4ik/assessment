(function () {
    "use strict";

    angular.module('design', [])
        .controller('DesignController', ['$scope', '$window', 'upload', DesignController]);

    function DesignController($scope, $window, uploadService) {
        var that = $scope,
            currentSettings = null,
            api = window.egApi;

        that.isError = false;


        that.background = new (function (saveChanges) {
            var self = this;

            self.image = {
                src: null,
                isUploading: false,
                isEmpty: true
            };

            self.type = 'fullscreen';

            self.setFullscreen = function () {
                self.type = 'fullscreen';
                saveChanges();
            };
            self.setRepeat = function () {
                self.type = 'repeat';
                saveChanges();
            };
            self.setOriginal = function () {
                self.type = 'original';
                saveChanges();
            };

            self.errorTitle = null;
            self.errorDescription = null;
            self.hasError = false;

            self.changeImage = function () {
                if (self.image.isUploading) {
                    return;
                }
                uploadService(function () {
                    self.image.isUploading = true;

                    self.hasError = false;
                    self.errorTitle = undefined;
                    self.errorDescription = undefined;

                    that.$apply();
                }).done(function (url) {
                    self.image.src = url;
                    self.image.isEmpty = false;

                }).fail(function (reason) {
                    self.image.src = null;
                    self.image.isEmpty = true;

                    self.hasError = true;
                    self.errorTitle = reason.title;
                    self.errorDescription = reason.description;
                }).always(function () {
                    self.image.isUploading = false;
                    saveChanges();

                    that.$apply();
                });
            };

            self.clearImage = function () {
                self.image.src = null;
                self.image.isEmpty = true;
                saveChanges();
            };

            self.init = function (background) {
                if (background && background.image) {
                    if (background.image.src) {
                        self.image.src = background.image.src;
                        self.image.isEmpty = false;
                    }
                    if (background.image.type) {
                        self.type = background.image.type;
                    }
                }
            }

        })(saveChanges);

        that.userAccess = (function () {
            var self = {};

            self.hasStarterPlan = true;
            self.init = init;

            return self;

            function init(userData) {
                self.hasStarterPlan = userData.accessType > 0;
            }
        })();

        that.logo = (function (saveChanges) {
            var self = {};

            self.url = '';
            self.isLoading = false;
            self.hasError = false;
            self.errorText = 'Unsupported image format';
            self.errorDescription = '(Supported formats: jpg, png, bmp)';

            self.hasLogo = hasLogo;
            self.clear = clear;
            self.upload = upload;

            self.init = init;

            return self;

            function hasLogo() {
                return self.url !== '';
            }

            function clear() {
                self.url = '';
                saveChanges();
            }

            function init(logoSettings) {
                self.url = '';
                if (logoSettings && logoSettings.url) {
                    self.url = logoSettings.url;
                }
            }

            function upload() {
                if (self.isLoading) {
                    return;
                }

                uploadService(function () {
                    setLoadingStatus();
                    that.$apply();
                }).done(function (url) {
                    self.url = url;
                    setDefaultStatus();
                }).fail(function (reason) {
                    setFailedStatus(reason.title, reason.description);
                }).always(function () {
                    saveChanges();
                    that.$apply();
                });
            }

            function setLoadingStatus() {
                self.clear();
                self.isLoading = true;
            }

            function setDefaultStatus() {
                self.isLoading = false;
                self.hasError = false;
            }

            function setFailedStatus(reasonTitle, reasonDescription) {
                self.clear();
                self.isLoading = false;
                self.hasError = true;
                self.errorText = reasonTitle;
                self.errorDescription = reasonDescription;
            }

        })(saveChanges);

        that.saveChanges = saveChanges;

        angular.element($window).on('blur', saveChanges);

        function saveChanges() {
            var newSettings = getCurrentSettings();

            if (angular.equals(currentSettings, newSettings)) {
                return;
            }

            api.saveSettings(JSON.stringify(newSettings), null).done(function () {
                currentSettings = newSettings;
            });
        };

        function getCurrentSettings(settings) {
            return $.extend({}, settings || currentSettings, {
                logo: {
                    url: that.logo.url
                },
                background: {
                    image: {
                        src: that.background.image.src,
                        type: that.background.type
                    }
                }
            });
        }

        //#region Initialization

        return api.init().then(function () {
            var user = api.getUser(),
                settings = api.getSettings();

            that.userAccess.init(user);
            that.logo.init(settings.logo);
            that.background.init(settings.background);

            currentSettings = getCurrentSettings(settings);

        }).fail(function () {
            that.isError = true;
        }).always(function () {
            that.$applyAsync();
            api.showSettings();
        });

        //#endregion Initialization
    }

})();