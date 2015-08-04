(function () {
    angular.module('assessment')
    .directive('imageLoader', imageLoader);
    function imageLoader() {
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
            var image = new Image();
            image.className = 'image';
            image.style.display = 'none';
            image.style.width = 'auto';
            image.style.height = 'auto';
            if (!scope.scaleBySmallerSide) {
                image.style.maxWidth = scope.width + 'px';
                image.style.maxHeight = scope.height + 'px';
            }
            $element.append(image);
            var $image = $(image);
            scope.$watch('url', function (url) {
                $image.hide();
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
                        var maxSize = width > height ? width : height; // grab image with bigger size to avoid reloading after screen rotation
                        resizedImageUrl = url + '?height=' + maxSize + '&width=' + maxSize;
                    }
                    image.onload = function () {
                        $imageLoaderIcon.hide();
                        $element.removeClass('loading');
                        $image.fadeIn();
                    };
                    image.src = resizedImageUrl;
                }
            });
        }
    }
}());