define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (collaboratorId) {
            return httpWrapper.post('api/course/collaboration/invite/accept', { collaboratorId: collaboratorId });
        }
    }

})