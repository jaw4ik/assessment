(function () {

    angular.module('assessment')
        .directive('courseTitle', courseTitle);

    function courseTitle() {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                var $element = $(element),
                    unbind = $scope.$watch(checkFontSize);

                function checkFontSize() {
                    var lenght = $element[0].innerHTML.length;

                    if (window.innerWidth > 640) {
                        changeFontSize($element, lenght, 20, 30);
                    } else {
                        changeFontSize($element, lenght, 22, 24);
                    }

                    unbind();
                }

            }
        };
    }

    function changeFontSize($element, lenght, minValue, maxValue) {
        if (lenght > 70) {
            lenght < 140 ? $element.css('font-size', maxValue + 'px') : $element.css('font-size', minValue + 'px');
        }
    }
}());