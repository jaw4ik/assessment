define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (courseId, collaboratorId) {
            return httpWrapper.post('api/course/collaboration/invite/accept', { courseId: courseId, collaboratorId: collaboratorId });
        }
    }

})