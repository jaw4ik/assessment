(function () {

    angular.module('quiz')
        .directive('imageLoader', imageLoader);

    imageLoader.$inject = ['imageLoaderService'];

    function imageLoader(imageLoaderService) {
        return {
            restrict: 'E',
            templateUrl: 'views/widgets/imageLoader.html',
            link: link
        };

        function link(scope, element, attrs) {
            var $element = $(element);
            var $imageContainer = $('.image-container', $element);
            var $imageLoaderIcon = $('.image-loader-icon', $element);

            scope.$watch(attrs.url, function (url) {
                $imageContainer.empty();
                $imageLoaderIcon.show();
                if (url) {
                    imageLoaderService.load(url).then(function (image) {
                        if (image) {
                            $imageContainer.append(image);

                            updatePreviewImageSize($imageContainer);
                            //$imageLoaderIcon.hide();
                            //$(image).fadeIn();
                        }
                    });
                }
            });

            //var resizeHandler = $(window).on('resize', function () {
            //        updatePreviewImageSize($element);
            //});

            //var orientationChangeHandler = $(window).on("orientationchange", function () {
            //        updatePreviewImageSize($element);
            //});

            //ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            //    $(window).unbind('resize', resizeHandler);
            //    $(window).unbind('orientationchange', orientationChangeHandler);
            //});

            function updatePreviewImageSize($element) {
                var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 46; // 46 - padding for close button
                var browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 46;

                $('.image', $element).css('maxWidth', browserWidth - 46 + 'px').css('maxHeight', browserHeight - 46 + 'px');
            }
        }
    }
}());