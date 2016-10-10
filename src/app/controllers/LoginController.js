(function () {
    'use strict';

    var constants = {
        email: /^[^@\s]+@[^@\s]+$/
    };

    angular
        .module('assessment')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$location', '$injector', 'settings', 'assessment', 'user', 'accessLimiter', 'userContext'];

    function LoginController($rootScope, $location, $injector, settings, assessment, user, accessLimiter, userContext) {
        var that = this,
            xAPIManager = $injector.has('xAPIManager') ? $injector.get('xAPIManager') : null;

        $rootScope.title = assessment.title;

        that.courseTitle = assessment.title;
        that.questionsLength = assessment.questions.length;
        that.username = user ? user.username : '';
        that.email = user ? user.email : '';
        that.account = user ? user.account : null;
        that.xAPIEnabled = settings.xApi.enabled;

        that.emailModified = false,
        that.usernameModified = false;

        that.allowToSkip = that.xAPIEnabled ? !settings.xApi.required : true;

        that.usernameIsValid = function () {
            return !!that.username && !!that.username.trim();
        };

        that.emailIsValid = function () {
            return !!that.email && (constants.email.test(that.email.trim()) || that.account);
        };

        that.markUsernameAsModified = function () {
            that.usernameModified = true;
        };

        that.markEmailAsModified = function () {
            that.emailModified = true;
        };

        that.submit = function () {
            if (that.usernameIsValid() && that.emailIsValid()) {
                    userContext.set(that.email.trim() , that.username.trim());

                    if (that.xAPIEnabled && accessLimiter.userHasAccess()) {
                        xAPIManager.init(assessment.id, assessment.title, $location.absUrl(), that.email.trim(), that.username.trim(), that.account, settings.xApi);
                    }

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

            if (that.xAPIEnabled) {
                xAPIManager.off();
            }

            $rootScope.skipLoginGuard = true;

            startCourse();
        };

        if (that.username || that.email || that.account) {
            that.submit();
        }

        function startCourse() {
            if (that.xAPIEnabled && accessLimiter.userHasAccess()) {
                $rootScope.isXApiInitialized = true;
            }

            $location.path('/').replace();
        }
    }
}());