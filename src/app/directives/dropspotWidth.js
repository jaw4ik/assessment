(function () {

    angular.module('quiz')
        .directive('dropspotWidth', dropspotWidth);

    function dropspotWidth() {
        
        return {
            restrict: 'A',
            link: function ($scope, element) {

                addWidth(element);
                
                $(element).on('dragstop', function () {
                    addWidth(element);
                    $('.dropspot.ui-droppable').css('width', '');
                });
            }
        };

        function addWidth(element) {
            $(element).one('drag', function () {
                $('.dropspot.ui-droppable.active').css('width', $(element).css('width'));
                
            });
        }
    }
}());