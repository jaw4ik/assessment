(function () {

    angular.module('assessment')
        .directive('droppable', droppable);

    function droppable() {
        return {
            restrict: 'A',
            scope: {
                acceptValue: '=',
                rejectValue: '=',
                accept: '=',
                scope: '='
            },
            link: function ($scope, element) {
                $(element).droppable({
                    accept: function (arg) {
                        if ($(element).find(arg).length) {
                            return true;
                        }
                        if ($scope.accept) {
                            return $scope.accept > $(element).find('.ui-draggable').length;
                        }
                        return $(arg).hasClass('ui-draggable');
                    },
                    activeClass: 'active',
                    greedy: true,
                    hoverClass: 'hover',
                    scope: $scope.scope || 'default',
                    tolerance: 'intersect',
                    drop: function (event, ui) {
                        ui.draggable.trigger('dragstop');

                        var draggable = ui.draggable.isolateScope();
                        if (draggable) {

                            var previous = $(ui.draggable).closest('[droppable]').isolateScope();
                            if (previous === $scope) {
                                return;
                            }

                            if ($scope.acceptValue) {
                                $scope.acceptValue(draggable.value);
                                $scope.$apply();

                                if (previous && previous.rejectValue) {
                                    previous.rejectValue(draggable.value);
                                    previous.$apply();
                                }

                            }
                        }

                    }
                });
            }
        };
    }

}());