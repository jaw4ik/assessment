(function () {

    angular.module('quiz')
        .directive('statement', statement);

    function statement() {
        return {
            restrict: 'E',
            templateUrl: 'views/statement.html'
        };
    }

}());