(function () {
    "use strict";
    angular.module('assessment')
		.service('accessLimiter', accessLimiter);

    accessLimiter.$inject = ['$injector', 'userContext'];

    function accessLimiter($injector, userContext) {
        var accessLimitation = { enabled: false },
            isInitialized = false;

        return {
            accessLimitationEnabled: accessLimitationEnabled,
            userHasAccess: userHasAccess,
            initialize: initialize
        };

        function accessLimitationEnabled() {
            if (!isInitialized) {
                initialize();
                isInitialized = true;
            }

            return accessLimitation.enabled;
        }

        function userHasAccess() {
            if (!accessLimitationEnabled())
                return true;
                
            var user = userContext.getCurrentUser();
            if (!user)
                return false;

            return _.some(accessLimitation.allowedUsers, function (item) {
                return _.isString(item.email) && (item.email.trim().toLowerCase() === user.email.trim().toLowerCase());
            });
        }

        function initialize() {
            var publishSettings = $injector.has('publishSettings') ? $injector.get('publishSettings') : null;
            if (!publishSettings || !publishSettings.accessLimitation || hasLms(publishSettings))
                return;

            accessLimitation = publishSettings.accessLimitation;
        }

        function hasLms(publishSettings) {
            var hasLms = false;
            if (publishSettings.modules) {
                hasLms = _.some(publishSettings.modules, function (module) {
                    return module.name === 'lms';
                });
            }

            return hasLms;
        }
    }

})();