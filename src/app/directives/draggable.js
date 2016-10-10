(function () {

    angular.module('assessment')
        .directive('draggable', draggable);

    function draggable() {
        return {
            restrict: 'A',
            scope: {
                value: '=',
                scope: '='
            },
            link: function ($scope, element) {
                $(element).css('touch-action','none');
				$(element).draggable({
                    containment: 'document',
                    appendTo: $(element).closest('section'),
                    helper: function () {
                        return $(element)
                            .clone()
                            .addClass('handle')
                            .css({
                                width: $(this).outerWidth(),
                                height: $(this).outerHeight()
                            });
                    },
                    scope: $scope.scope || 'default',                    
                    revert: true,
                    revertDuration: 0,
                    zIndex: 10000,
                    refreshPositions: true,

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