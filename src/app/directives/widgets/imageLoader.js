(function () {

    angular.module('quiz')
        .directive('imageLoader', imageLoader);

    imageLoader.$inject = ['imageLoaderService'];

    function imageLoader(imageLoaderService) {
        return {
            restrict: 'E',
            replace: true,
            scope: { width: '=', height: '=', url: '=' },
            templateUrl: 'views/widgets/imageLoader.html',
            link: link
        };

        function link(scope, element) {
            var $element = $(element);
            var $imageContainer = $('.image-container', $element);
            var $imageLoaderIcon = $('.image-loader-icon', $element);

            scope.$watch('url', function (url) {
                $imageContainer.empty();
                $imageLoaderIcon.show();
                if (url) {
                    imageLoaderService.load(url, scope.width, scope.height).then(function (image) {
                        if (image) {
                            $imageContainer.append(image);
                            $imageLoaderIcon.hide();
                            $(image).fadeIn();
                        }
                    });
                }
            });
        }
    }
}());