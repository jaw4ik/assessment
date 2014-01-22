define(['plugins/http', 'localization/localizationManager'],
    function (http, localizationManager) {
        
        var buildCourse = function (courseId) {
            return invokeServiceMethod('course/build', { courseId: courseId }, function (responseData) {
                return { packageUrl: responseData.PackageUrl, builtOn: new Date(parseInt(responseData.BuildOn.substr(6), 10)) };
            });
        };
        
        var scormBuildCourse = function (courseId) {
            return invokeServiceMethod('course/scormbuild', { courseId: courseId }, function (responseData) {
                return { scormPackageUrl: responseData.ScormPackageUrl };
            });
        };

        var publishCourse = function (courseId) {
            return invokeServiceMethod('course/publish', { courseId: courseId }, function (responseData) {
                return { publishedPackageUrl: responseData.PublishedPackageUrl };
            });
        };

        var publishCourseToStore = function (courseId) {
            return invokeServiceMethod('course/publishToStore', { courseId: courseId }, function() {});
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
            buildCourse: buildCourse,
            publishCourse: publishCourse,
            scormBuildCourse: scormBuildCourse,
            publishCourseToStore: publishCourseToStore
        };
});