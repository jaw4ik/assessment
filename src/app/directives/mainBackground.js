(function () {

    angular.module('assessment')
        .directive('mainBackground', directive);

    directive.$inject = ['settings'];


    function directive(settings) {

        return {
            restrict: 'C',
            link: function ($scope, $element) {
                var background = settings.background;
                if (!_.isObject(background) || !_.isObject(background.image) || !_.isString(background.image.src)) {
                    return;
                }

                var image = new Image(),
                    src = background.image.src,
                    position = '0 0',
                    repeat = 'no-repeat',
                    size = 'auto';


                if (background.image.type === 'repeat') {
                    repeat = 'repeat';
                }

                if (background.image.type === 'fullscreen') {
                    size = 'cover';
                    position = 'center';
                }

                image.onload = function () {
                    $element.css({
                        'background-image': 'url(' + src + ')',
                        'background-position': position,
                        '-webkit-background-size': size,
                        'background-size': size,
                        'background-repeat': repeat
                    });
                };

                image.src = src;

            }
        };
    }

}());