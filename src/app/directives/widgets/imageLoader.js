(function () {

    angular.module('quiz')
        .directive('imageLoader', imageLoader);

    imageLoader.$inject = ['imageLoaderService'];

    function imageLoader(imageLoaderService) {
        return {
            restrict: 'E',
            scope: {
                width: '=',
                height: '=',
                url: '=',
                scaleBySmallerSide: '='
            },
            templateUrl: 'app/views/widgets/imageLoader.html',
            link: link
        };

        function link(scope, element) {
            var $element = $(element);
            var $imageLoaderIcon = $('.image-loader-icon', $element);

            scope.$watch('url', function (url) {
                $('.image', $element).remove();
                $element.addClass('loading');
                $imageLoaderIcon.show();
                if (url) {
                    $element.addClass('loading');

                    var width = scope.width;
                    var height = scope.height;
                    var resizedImageUrl = '';
                    if (scope.scaleBySmallerSide) {
                        resizedImageUrl = url + '?height=' + height + '&width=' + width + '&scaleBySmallerSide=true';
                    } else {
                        var maxSize = width > height ? width : height; // grab image with bigger size to avoid reloading afre screen rotation
                        resizedImageUrl = url + '?height=' + maxSize + '&width=' + maxSize;
                    }
                    imageLoaderService.load(resizedImageUrl).then(function (image) {
                        if (image) {
                            image.className = 'image';
                            image.style.display = 'none';
                            image.style.width = 'auto';
                            image.style.height = 'auto';
                            if (!scope.scaleBySmallerSide) {
                                image.style.maxWidth = width + 'px';
                                image.style.maxHeight = height + 'px';
                            }
                            $element.append(image);
                            $imageLoaderIcon.hide();
                            $element.removeClass('loading');
                            $(image).fadeIn();
                        }
                    });
                }
            });
        }
    }
}());