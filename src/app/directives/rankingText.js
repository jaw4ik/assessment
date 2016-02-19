(function (angular) {

    angular.module('assessment')
        .directive('rankingText', rankingText);

    rankingText.$inject = ['dragulaService'];

    function rankingText(dragulaService) {
        return {
            link: function (scope, element) {
                dragulaService.options(scope, scope.question.id, {
                    mirrorContainer: element[0]
                });
            }
        };
    }

} (window.angular));