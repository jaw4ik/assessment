(function () {
    'use strict';
    
    //Unlike ngBindHtml, this directive allows you to use nested bindings and emit event $includeContentLoaded.
    angular.module('assessment').directive('htmlCompile', directive);

    directive.$inject = ['$compile'];

    function directive($compile) {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                var unbind = $scope.$watch(attrs.htmlCompile, set);

                function set(newValue) {
                    if (!_.isUndefined(newValue)) {
                        $element.html(newValue);
                        $compile($element.contents())($scope);
                        $scope.$emit('$includeContentLoaded');
                        unbind();
                    }
                }
            }
        };
    }
}());
