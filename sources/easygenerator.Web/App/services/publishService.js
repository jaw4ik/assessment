define(['http/apiHttpWrapper'],
    function (apiHttpWrapper) {
        "use strict";

        function buildCourse(courseId) {
            return apiHttpWrapper.post('api/course/build', { courseId: courseId }).then(function (data) {
                return {
                    packageUrl: data.PackageUrl,
                    builtOn: new Date(data.BuildOn)
                };
            });
        };

        function publishCourse(courseId) {
            return apiHttpWrapper.post('api/course/publish', { courseId: courseId }).then(function (data) {
                return {
                    publishedPackageUrl: data.PublishedPackageUrl
                };
            });
        };

        function scormBuildCourse(courseId) {
            return apiHttpWrapper.post('api/course/scormbuild', { courseId: courseId }).then(function (data) {
                return {
                    scormPackageUrl: data.ScormPackageUrl
                };
            });
        };

      
        function publishCourseToStore(courseId) {
            return apiHttpWrapper.post('api/aim4you/publish', { courseId: courseId });
        };

        function publishCourseForReview(courseId) {
            return apiHttpWrapper.post('api/course/publishForReview', { courseId: courseId }).then(function (data) {
                return {
                    reviewUrl: data.ReviewUrl
                };
            });
        };

        function buildLearningPath(learningPathId) {
            return apiHttpWrapper.post('api/learningpath/build', { learningPathId: learningPathId }).then(function (data) {
                return {
                    packageUrl: data.PackageUrl
                };
            });
        };

        return {
            buildCourse: buildCourse,
            publishCourse: publishCourse,
            scormBuildCourse: scormBuildCourse,
            publishCourseToStore: publishCourseToStore,
            publishCourseForReview: publishCourseForReview,
            buildLearningPath: buildLearningPath
        };
    });