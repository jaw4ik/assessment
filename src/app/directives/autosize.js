(function () {

    angular.module('quiz')
        .directive('autosize', autosizeDirective);

    function autosizeDirective() {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element) {
            autosize($(element), { setOverflowX: false, setOverflowY: false});
        }
    }
}());