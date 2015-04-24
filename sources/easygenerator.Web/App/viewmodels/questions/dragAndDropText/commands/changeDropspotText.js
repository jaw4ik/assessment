define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (id, text) {
            return Q.fcall(function () {
                return httpWrapper.post('/api/question/draganddrop/dropspot/updateText', { dropspotId: id, text: text });
            });
        }
    }

})