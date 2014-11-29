(function () {

    angular.module('quiz')
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
                    hoverClass: 'hover',
                    scope: $scope.scope || 'default',
                    tolerance: 'pointer',
                    drop: function (event, ui) {
                        ui.draggable.trigger('dragstop');
                        $(element).removeClass('hover active');

                        var draggable = ui.draggable.isolateScope();
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
                });
            }
        };
    }

}());