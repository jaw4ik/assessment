(function () {

    angular.module('quiz')
        .directive('entireHeight', entireHeight);

    function entireHeight() {
        return {
            restrict: 'A',
            link: function ($scope, $element) {

                $(window).resize(changeHeight);
                _.defer(changeHeight);

                function changeHeight() {
                    $element.css('height', 'auto');

                    var screenHeight = $(window).height(),
                        elementScrollHeight = $element[0].scrollHeight;

                    $element.css('height', screenHeight > elementScrollHeight ? screenHeight : elementScrollHeight);
                }
            }
        };
    }

}());