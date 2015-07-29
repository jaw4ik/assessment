(function () {

    angular.module('assessment')
        .filter('leadingZeros', pad);

    function pad() {
        return function (number, length) {
            var str = number + '';
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        };
    }

}());