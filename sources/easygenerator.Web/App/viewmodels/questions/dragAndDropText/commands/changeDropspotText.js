define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (id, text) {
            return Q.fcall(function () {
                return apiHttpWrapper.post('/api/question/draganddrop/dropspot/updateText', { dropspotId: id, text: text });
            });
        }
    }

})