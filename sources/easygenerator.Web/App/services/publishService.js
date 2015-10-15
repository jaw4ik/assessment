define(['http/publishHttpWrapper'],
    function (publishHttpWrapper) {
        "use strict";

        function buildCourse(courseId) {
            return publishHttpWrapper.post('api/course/build', { courseId: courseId }).then(function (data) {
                return {
                    packageUrl: data.PackageUrl,
                    builtOn: new Date(data.BuildOn)
                };
            });
        };

        function publishCourse(courseId) {
            return publishHttpWrapper.post('api/course/publish', { courseId: courseId }).then(function (data) {
                return {
                    publishedPackageUrl: data.PublishedPackageUrl
                };
            });
        };

        function scormBuildCourse(courseId) {
            return publishHttpWrapper.post('api/course/scormbuild', { courseId: courseId }).then(function (data) {
                return {
                    scormPackageUrl: data.ScormPackageUrl
                };
            });
        };

        function publishCourseToCustomLms(courseId) {
            return publishHttpWrapper.post('api/course/publishToCustomLms', { courseId: courseId });
        };

        function publishCourseForReview(courseId) {
            return publishHttpWrapper.post('api/course/publishForReview', { courseId: courseId }).then(function (data) {
                return {
                    reviewUrl: data.ReviewUrl
                };
            });
        };

        function buildLearningPath(learningPathId) {
            return publishHttpWrapper.post('api/learningpath/build', { learningPathId: learningPathId }).then(function (data) {
                return {
                    packageUrl: data.PackageUrl
                };
            });
        };

        function publishLearningPath(learningPathId) {
            return publishHttpWrapper.post('api/learningpath/publish', { learningPathId: learningPathId }).then(function (data) {
                return {
                    publicationUrl: data.PublicationUrl
                };
            });
        };

        return {
            buildCourse: buildCourse,
            publishCourse: publishCourse,
            scormBuildCourse: scormBuildCourse,
            publishCourseToCustomLms: publishCourseToCustomLms,
            publishCourseForReview: publishCourseForReview,
            buildLearningPath: buildLearningPath,
            publishLearningPath: publishLearningPath
        };
    });