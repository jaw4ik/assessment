(function () {
    'use strict';

    angular.module('quiz').directive('htmlCompile', directive);

    directive.$inject = ['$compile'];

    function directive($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.htmlCompile, function (newValue) {
                    element.html(newValue);
                    $compile(element.contents())(scope);
                });
            }
        };
    }
}());