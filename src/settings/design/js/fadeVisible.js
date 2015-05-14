(function () {
    "use strict";

    angular.module('design')
        .directive('fadeVisible', fadeVisible);

    function fadeVisible() {
        return {
            restrict: 'A',
            scope: {
                fadeVisibleValue: '='
            },
            link: function (scope, element) {
                var $element = $(element);

                $element.toggle(scope.fadeVisibleValue);

                scope.$watch('fadeVisibleValue', function (value) {
                    if (value) {
                        $element.fadeIn();
                    } else {
                        $element.fadeOut();
                    }
                });
            }
        };
    }

})();
