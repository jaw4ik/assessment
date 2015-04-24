define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (id, x, y) {
            return Q.fcall(function () {
                return httpWrapper.post('/api/question/draganddrop/dropspot/updatePosition', { dropspotId: id, x: x, y: y });
            });
        }
    }

})