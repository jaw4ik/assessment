(function () {
    
    angular.module('assessment')
        .directive('background', radio);

    function radio() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.css('background-position', '0 0').css('background-repeat', 'no-repeat');

                var src = attrs.background, image;
                if (src) {
                    image = new Image();
                    image.onload = function () {
                        element
                            .css('background-image', 'url(' + src + ')')
                            .css('height', image.height)
                            .css('width', image.width);
                    };
                    image.src = src;
                }
            }
        };
    }

}());