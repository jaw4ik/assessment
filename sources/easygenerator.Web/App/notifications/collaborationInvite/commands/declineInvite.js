define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (inviteId) {
            return httpWrapper.post('api/course/collaboration/invite/decline', { collaborationInviteId: inviteId });
        }
    }

})