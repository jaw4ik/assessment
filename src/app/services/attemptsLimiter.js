(function () {
    "use strict";

    angular.module('quiz')
		.service('attemptsLimiter', attemptsLimiter);

    attemptsLimiter.$inject = ['$rootScope', 'settings'];

    function attemptsLimiter($rootScope, settings) {
        var self = {
            attemptCount: 0
        };

        if (settings.attempt.hasLimit) {
            $rootScope.$on('course:started', function () {
                self.attemptCount++;
            });
        }

        return {
            hasLimit: settings.attempt.hasLimit,
            hasAvailableAttempt: hasAvailableAttempt,
            getAvailableAttemptCount: getAvailableAttemptCount
        };


        function hasAvailableAttempt() {
            return getAvailableAttemptCount() > 0;
        }

        function getAvailableAttemptCount() {
            if (!settings.attempt.hasLimit)
                return Infinity;

            return settings.attempt.limit - self.attemptCount;
        }
    }

})();