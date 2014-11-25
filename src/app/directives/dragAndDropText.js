(function () {

    angular.module('quiz')
        .directive('dragAndDropText', dragAndDropText);

    function dragAndDropText() {
        return {
            restrict: 'E',
            templateUrl: 'views/dragAndDropText.html',
            replace: true
        };
    }

}());