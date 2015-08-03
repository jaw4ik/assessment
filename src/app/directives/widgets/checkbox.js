(function () {

    angular.module('assessment')
        .directive('checkbox', checkbox);

    function checkbox() {
        return {
            scope: {
                checked: '=',
                title: '@'
            },
            replace: true,
            restrict: 'E',
            template: '<label class="checkbox" ng-class="{ checked: checked }">{{title}}</label>'
        };
    }

}());