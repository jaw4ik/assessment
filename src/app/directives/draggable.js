(function () {

    angular.module('quiz')
        .directive('draggable', draggable);

    function draggable() {
        return {
            restrict: 'A',
            scope: {
                value: '=',
                scope: '='
            },
            link: function ($scope, element) {
                $(element).draggable({
                    containment: 'body',
                    appendTo: $(element).closest('section'),
                    helper: 'clone',
                    scope: $scope.scope || 'default',
                    tolerance: 'pointer',
                    revert: true,
                    revertDuration: 0,
                    zIndex: 10000,

                    start: function () {
                        $(element).css('visibility', 'hidden');
                    },
                    stop: function () {
                        $(element).css('visibility', 'visible');
                    }
                });
            }
        };
    }

}());