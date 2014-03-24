define(['dataContext', 'plugins/http', 'localization/localizationManager'], function (dataContext, http, localizationManager) {

    var service = {
        register: register
    };

    function register() {
        return Q.fcall(function() {
            var defer = Q.defer();

            http.post('api/aim4you/registerUser').done(function(response) {
                if (_.isUndefined(response)) {
                    defer.reject('Response has invalid format');
                } else if (response.success) {
                    dataContext.userSettings.isRegisteredOnAim4You = true;
                    defer.resolve(response);
                } else {
                    var message = response.resourceKey ? localizationManager.localize(response.resourceKey) : response.message;
                    defer.reject(message);
                }
            });

            return defer.promise;
        });
    }

    return service;

})