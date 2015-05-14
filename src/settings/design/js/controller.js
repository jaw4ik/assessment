(function () {
    "use strict";

    angular.module('design', [])
        .controller('DesignController', ['$scope', '$window', 'upload', DesignController]);

    function DesignController($scope, $window, uploadService) {
        var that = $scope,
            currentSettings = null,
            api = window.egApi;

        that.isError = false;

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

        }).fail(function () {
            that.isError = true;
        }).always(function () {
            that.$applyAsync();
        });

        //#endregion Initialization
    }

})();