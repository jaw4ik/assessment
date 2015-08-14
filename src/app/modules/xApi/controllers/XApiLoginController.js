(function () {
    'use strict';

    var constants = {
        email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/
    };

    angular
        .module('assessment.xApi')
        .controller('XApiLoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$location', 'xAPIManager', 'settings', 'assessment', 'user'];

    function LoginController($rootScope, $location, xAPIManager, settings, assessment, user) {
        var that = this;

        $rootScope.title = assessment.title;

        that.courseTitle = assessment.title;
        that.questionsLength = assessment.questions.length;
        that.username = user ? user.username : '';
        that.email = user ? user.email : '';

        that.emailModified = false,
        that.usernameModified = false;

        that.allowToSkip = !settings.xApi.required;

        that.usernameIsValid = function () {
            return !!that.username && !!that.username.trim();
        };

        that.emailIsValid = function () {
            return !!that.email && constants.email.test(that.email.trim());
        };

        that.markUsernameAsModified = function () {
            that.usernameModified = true;
        };

        that.markEmailAsModified = function () {
            that.emailModified = true;
        };

        that.submit = function () {
            if (that.usernameIsValid() && that.emailIsValid()) {
                xAPIManager.init(assessment.id, assessment.title, $location.absUrl(), that.email.trim(), that.username.trim(), settings.xApi);
                startCourse();
            } else {
                that.markUsernameAsModified();
                that.markEmailAsModified();
            }
        };

        that.skip = function () {
            if (!that.allowToSkip) {
                return;
            }

            xAPIManager.off();
            startCourse();
        };

        if (that.username && that.email) {
            that.submit();
        }

        function startCourse() {
            $rootScope.isXApiInitialized = true;
            $location.path('/').replace();
        }
    }
}());