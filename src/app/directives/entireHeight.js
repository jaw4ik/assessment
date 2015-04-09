(function () {

    angular.module('quiz')
        .directive('entireHeight', entireHeight);

    function entireHeight() {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                var $element = $(element);

                changeHeight();

                $(window).resize(function () {
                    changeHeight();
                });

                function changeHeight() {
                    var screenHeight = $(window).height();

                    $element.css('height', screenHeight);
                }
            }
        };
    }
}());