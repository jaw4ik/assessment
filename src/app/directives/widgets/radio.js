(function () {

    angular.module('assessment')
        .directive('radio', radio);

    function radio() {
        return {
            scope: {
                checked: '=',
                title: '@'
            },
            replace: true,
            restrict: 'E',
            template: '<label class="radio" ng-class="{ checked: checked }">{{title}}</label>'
        };
    }

}());