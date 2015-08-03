(function () {

    angular.module('assessment')
        .directive('imageFullscreenPreview', imageFullscreenPreview);

    function imageFullscreenPreview() {
        return {
            restrict: 'A',
            transclude: true,
            template: '',
            link: link
        };

        function link(scope, element) {
            var $element = $(element);
            var size = getPreviewImageSize();
            scope.preview.width = size.width;
            scope.preview.height = size.height;

            var resizeHandler = $(window).on('resize', function () {
                updatePreviewImageSize($element);
            });

            var orientationChangeHandler = $(window).on('orientationchange', function () {
                updatePreviewImageSize($element);
            });

            scope.$on('$destroy', unbindEvents);

            function unbindEvents() {
                $(window).unbind('resize', resizeHandler);
                $(window).unbind('orientationchange', orientationChangeHandler);
            }

            function updatePreviewImageSize($element) {
                var size = getPreviewImageSize();
                scope.preview.width = size.width;
                scope.preview.height = size.height;
                var browserWidth = size.width;
                var browserHeight = size.height;

                $('img', $element).css('maxWidth', browserWidth + 'px').css('maxHeight', browserHeight + 'px');
            }

            function getPreviewImageSize() {
                return {
                    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 92,
                    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 92
                };
            }
        }
    }
}());