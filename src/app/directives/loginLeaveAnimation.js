(function () {
    'use strict';

    angular.module('assessment').directive('loginLeave', directive);

    function directive() {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                var $parent = $element.closest('.login'),
                    $containerToLeft = $parent.find('.login-container'),
                    $overlay = $parent.find('.login-overlay'),
                    $loader = $parent.find('.loader-container'),
                    loginController = $scope.login,
                    duration = 300,
                    leftOffset = 60;

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
                        left: '-' + (containerWidth + leftOffset) + 'px'
                    }, duration, function () {
                        $loader.show();
                        $overlay.animate({
                            'background-color': 'white'
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