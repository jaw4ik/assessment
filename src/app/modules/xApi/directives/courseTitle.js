(function () {

    angular.module('assessment.xApi')
        .directive('courseTitle', courseTitle);

    function courseTitle() {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                var $element = $(element),
                    unbind = $scope.$watch(checkFontSize);

                function checkFontSize() {
                    var lenght = $element[0].innerHTML.length;

                    if (lenght > 70) {
                        lenght < 140 ? $element.css('font-size', '30px') : $element.css('font-size', '20px');
                    }
                    unbind();
                }

            }
        };
    }
}());