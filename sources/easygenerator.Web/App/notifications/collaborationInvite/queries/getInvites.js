define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function () {
            return httpWrapper.post('api/course/collaboration/invites');
        }
    }

})