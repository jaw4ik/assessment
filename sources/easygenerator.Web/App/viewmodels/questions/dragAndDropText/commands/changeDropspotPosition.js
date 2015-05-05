define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (id, x, y) {
            return Q.fcall(function () {
                return apiHttpWrapper.post('/api/question/draganddrop/dropspot/updatePosition', { dropspotId: id, x: x, y: y });
            });
        }
    }

})