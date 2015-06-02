(function () {
    'use strict';

    var constants = {
        email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/
    };

    angular
        .module('quiz.xApi')
        .controller('XApiLoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$location', 'xAPIManager', 'settings', 'quiz'];

    function LoginController($rootScope, $location, xAPIManager, settings, quiz) {
        var that = this;

        $rootScope.title = quiz.title;

        that.courseTitle = quiz.title;
        that.questionsLength = quiz.questions.length;
        that.username = '';
        that.email = '';

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
                xAPIManager.init(quiz.id, quiz.title, $location.absUrl(), that.email.trim(), that.username.trim(), settings.xApi);
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

        function startCourse() {
            quiz.start();
            $location.path('/').replace();
        }
    }
}());