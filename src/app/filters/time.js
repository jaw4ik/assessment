(function () {

    angular.module('assessment')
        .filter('time', timeFilter);

    function timeFilter() {
        return function (secondsValue, type) {
            switch (type) {
                case 'h':
                    return Math.floor(secondsValue / 3600);
                case 'm':
                    return Math.floor(secondsValue % 3600 / 60);
                case 's':
                    return Math.floor(secondsValue % 3600 % 60);
            }
        };
    }

})();