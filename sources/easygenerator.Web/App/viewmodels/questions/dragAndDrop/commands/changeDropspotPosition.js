define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, id, x, y) {
            return Q.fcall(function () {
                return httpWrapper.post('/api/question/draganddrop/dropspot/updatePosition', { questionId: questionId, id: id, x: x, y: y });
            });
        }
    }

})