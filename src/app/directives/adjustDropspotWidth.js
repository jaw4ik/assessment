(function () {

    angular.module('assessment')
        .directive('adjustDropspotWidth', adjustDropspotWidth);

    function adjustDropspotWidth() {
        
        return {
            restrict: 'A',
            link: function ($scope, element) {
                var $element = $(element);
                var $question = $(element).closest('.question');
                addDragHandler($element, $question);
                
                $element.on('dragstop', function () {
                    addDragHandler($element, $question);
                    $('.dropspot.ui-droppable', $question).css('width', '');
                });
            }
        };

        function addDragHandler($element, $question) {
            $element.one('drag', function () {
                $('.dropspot.ui-droppable.active', $question).css('width', $element.css('width'));
            });
        }
    }
}());