define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (courseId, collaboratorId) {
            return apiHttpWrapper.post('api/course/collaboration/invite/decline', { courseId: courseId, collaboratorId: collaboratorId });
        }
    }

})