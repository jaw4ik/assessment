define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, id, text) {
            return Q.fcall(function() {
                return httpWrapper.post('/api/question/draganddrop/dropspot/updateText', { questionId: questionId, id: id, text: text });
            });
        }
    }

})