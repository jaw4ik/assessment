define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (inviteId) {
            return httpWrapper.post('api/course/collaboration/invite/accept', { collaborationInviteId: inviteId });
        }
    }

})