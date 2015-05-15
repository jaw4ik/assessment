define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (courseId, collaboratorId) {
            return apiHttpWrapper.post('api/course/collaboration/invite/accept', { courseId: courseId, collaboratorId: collaboratorId });
        }
    }

})