define(['http/apiHttpWrapper', 'localization/localizationManager'],
    function (apiHttpWrapper, localizationManager) {
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

            apiHttpWrapper.post(methodPath, methodArgs).done(function (data) {
                if (data != undefined) {
                    deferred.resolve(responseDataExtractor(data));
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