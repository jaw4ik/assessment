define(['plugins/http', 'localization/localizationManager'],
    function (http, localizationManager) {
        
        var buildExperience = function (experienceId) {
            return invokeServiceMethod('experience/build', { experienceId: experienceId }, function (responseData) {
                return { packageUrl: responseData.PackageUrl, builtOn: new Date(parseInt(responseData.BuildOn.substr(6), 10)) };
            });
        };

        var publishExperience = function (experienceId) {
            return invokeServiceMethod('experience/publish', { experienceId: experienceId }, function (responseData) {
                return { publishedPackageUrl: responseData.PublishedPackageUrl };
            });
        };

        var invokeServiceMethod = function (methodPath, methodArgs, responseDataExtractor) {
            
            var deferred = Q.defer();

            http.post(methodPath, methodArgs)
                .done(function (response) {
                    if (_.isUndefined(response) || _.isUndefined(response.success)) {
                        deferred.reject('Response has invalid format');
                    }
                    else if (response.success && response.data != undefined) {
                        deferred.resolve(responseDataExtractor(response.data));
                    } else {
                        var message = response.resourceKey ? localizationManager.localize(response.resourceKey) : response.message;
                        deferred.reject(message);
                    }
                })
                .fail(function () {
                    deferred.reject();
                });

            return deferred.promise;
        };

        return {
            buildExperience: buildExperience,
            publishExperience: publishExperience
        };
});