define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (courseId, collaboratorId) {
            return httpWrapper.post('api/course/collaboration/invite/decline', { courseId: courseId, collaboratorId: collaboratorId });
        }
    }

})