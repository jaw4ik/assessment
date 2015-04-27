define(['plugins/http', 'localization/localizationManager'],
    function (http, localizationManager) {
        "use strict";

        var buildCourse = function (courseId) {
            return invokeServiceMethod('course/build', { courseId: courseId }, function (responseData) {
                return { packageUrl: responseData.PackageUrl, builtOn: new Date(responseData.BuildOn) };
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

        var publishCourseForReview = function (courseId) {
            return invokeServiceMethod('course/publishForReview', { courseId: courseId }, function (responseData) {
                return { reviewUrl: responseData.ReviewUrl };
            });
        };

        var publishCourseToStore = function (courseId) {
            return invokeServiceMethod('api/aim4you/publish', { courseId: courseId }, function () { });
        };

        var invokeServiceMethod = function (methodPath, methodArgs, responseDataExtractor) {
            var deferred = Q.defer();

            http.post(methodPath, methodArgs).done(function (response) {
                if (_.isUndefined(response) || _.isUndefined(response.success)) {
                    deferred.reject('Response has invalid format');
                } else if (response.success && response.data != undefined) {
                    deferred.resolve(responseDataExtractor(response.data));
                } else {
                    var message = response.resourceKey ? localizationManager.localize(response.resourceKey) : response.message;
                    deferred.reject(message);
                }
            }).fail(function () {
                deferred.reject();
            });

            return deferred.promise;
        };

        return {
            buildCourse: buildCourse,
            publishCourse: publishCourse,
            scormBuildCourse: scormBuildCourse,
            publishCourseToStore: publishCourseToStore,
            publishCourseForReview: publishCourseForReview
        };
    });