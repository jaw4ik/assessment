(function () {

    angular.module('assessment')
        .directive('clickableArea', clickableArea);

    function clickableArea() {
        return {
            scope: {
                clickHandler: '='
            },
            restrict: 'A',
            link: link
        };

        function link(scope, element) {
            var offset, x, y;

            $(element).on('click', handler);

            function handler(e) {
                offset = $(element).offset();
                x = e.pageX - offset.left;
                y = e.pageY - offset.top;

                // workaround for specific version of Chrome with next bug:
                // https://code.google.com/p/chromium/issues/detail?id=423802
                if (isChromeWithPageCoordsBug()) {
                    x -= window.scrollX;
                    y -= window.scrollY;
                }

                if (typeof (scope.clickHandler) === 'function') {
                    scope.clickHandler({
                        x: x,
                        y: y
                    });
                    scope.$apply();
                }
            }

            function isChromeWithPageCoordsBug() {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/(chrome)\/?\s*([\d\.]+)/i)) {
                    return window.navigator.appVersion.match(/Chrome\/(.*?) /)[1] === '38.0.2125.102';
                }
                return false;
            }

        }
    }
}());