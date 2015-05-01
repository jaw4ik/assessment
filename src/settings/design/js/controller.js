(function () {
    "use strict";

    angular.module('design', [])
        .controller('DesignController', ['$scope', '$window', 'upload', DesignController]);

    function DesignController($scope, $window, uploadService) {
        var that = $scope,
            currentSettings = null,
            api = window.egApi;

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
            var self = {},
                isLoading = false;

            self.url = '';
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
            }

            function init(logoSettings) {
                self.url = '';
                if (logoSettings && logoSettings.url) {
                    self.url = logoSettings.url;
                }
            }

            function upload() {
                if (isLoading) {
                    return;
                }

                uploadService(function () {
                    setLoadingStatus();
                }).done(function (url) {
                    self.url = url;
                    setDefaultStatus();
                }).fail(function (reason) {
                    setFailedStatus(reason.title, reason.description);
                }).always(function () {
                    that.$apply();
                });
            }

            function setLoadingStatus() {
                isLoading = true;
            }

            function setDefaultStatus() {
                isLoading = false;
                self.hasError = false;
            }

            function setFailedStatus(reasonTitle, reasonDescription) {
                isLoading = false;
                self.clear();
                self.errorText = reasonTitle;
                self.errorDescription = reasonDescription;
                self.hasError = true;
            }

        })(),

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
                }
            });
        }

        //#region Initialization

        return api.init().then(function () {
            var user = api.getUser(),
                settings = api.getSettings();

            that.userAccess.init(user);
            that.logo.init(settings.logo);

            currentSettings = getCurrentSettings(settings);
            that.$applyAsync();

        }).fail(function () {
            api.sendNotificationToEditor('Settings are not initialized.', false);
        });

        //#endregion Initialization
    }

})();