(function () {
    'use strict';

    angular.module('quiz.xApi').directive('loginLeave', directive);

    function directive() {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                var $parent = $element.closest('.login'),
                    $containerToLeft = $parent.find('.login-container'),
                    loginController = $scope.login,
                    duration = 300;

                $element.on('click', function () {
                    if (attrs.loginLeave === 'skip') {
                        animation(loginController.skip);
                    } else {
                        if (loginController.usernameIsValid() && loginController.emailIsValid()) {
                            animation(loginController.submit);
                        } else {
                            loginController.submit();
                            $scope.$apply();
                        }
                    }
                });

                function animation(calllback) {
                    var containerWidth = $containerToLeft.width();
                    $containerToLeft.animate({
                        left: '-' + (containerWidth + 60) + 'px'
                    }, duration, function () {
                        $parent.animate({
                            opacity: 0
                        }, duration, function () {
                            calllback.apply();
                            $scope.$apply();
                        });
                    });

                }
            }
        };
    }
}());