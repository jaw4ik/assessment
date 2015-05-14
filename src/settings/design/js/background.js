(function () {
    "use strict";

    angular.module('design')
        .directive('background', background);

    function background() {
        return {
            restrict: 'A',
            scope: {
                src: '='
            },
            link: function (scope, $element) {
                $element.css('background-size', 'cover')
                    .css('background-position', 'center')
                    .css('background-repeat', 'no-repeat')
                    .css('background-image', 'none');

                scope.$watch('src', function (value) {
                    $element.css('background-image', 'none')
                    if (value) {
                        var image = new Image();
                        image.onload = function () {
                            $element.css('background-image', 'url(' + value + ')')
                        };
                        image.src = value;
                    }
                });

            }
        };
    }

})();
