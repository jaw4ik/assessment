(function () {
    "use strict";

    angular.module('assessment')
		.service('attemptsLimiter', attemptsLimiter);

    attemptsLimiter.$inject = ['$rootScope', 'settings'];

    function attemptsLimiter($rootScope, settings) {
        var self = {
            attemptCount: 0,
            limit: settings.attempt.hasLimit ? settings.attempt.limit : Infinity,
        };

        if (settings.attempt.hasLimit) {
            $rootScope.$on('course:started', function () {
                self.attemptCount++;
            });
        }

        return {
            limit: self.limit,
            hasLimit: settings.attempt.hasLimit,
            hasAvailableAttempt: hasAvailableAttempt,
            getAvailableAttemptCount: getAvailableAttemptCount
        };

        function hasAvailableAttempt() {
            return getAvailableAttemptCount() > 0;
        }

        function getAvailableAttemptCount() {
            return self.limit - self.attemptCount;
        }
    }

})();