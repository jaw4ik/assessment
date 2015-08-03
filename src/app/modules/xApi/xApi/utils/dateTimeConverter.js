(function () {
    'use strict';

    angular.module('assessment.xApi').factory('dateTimeConverter', factory);

    function factory() {
        return {
            timeToISODurationString: timeToISODurationString
        };

        function timeToISODurationString(timeInMilliseconds) {
            timeInMilliseconds /= 1000;
            var hours = parseInt(timeInMilliseconds / 3600, 10);
            timeInMilliseconds -= hours * 3600;
            var minutes = parseInt(timeInMilliseconds / 60, 10);
            timeInMilliseconds -= minutes * 60;
            var seconds = parseInt(timeInMilliseconds, 10);
            return 'PT' + hours + 'H' + minutes + 'M' + seconds + 'S';
        }
    }
}());