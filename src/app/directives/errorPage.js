(function () {

    angular.module('quiz')
        .directive('errorPage', errorPage);

    function errorPage() {
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