define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (id, key) {
            return Q.fcall(function () {
                return httpWrapper.post('/api/question/textmatching/answer/updateKey', { answerId: id, key: key });
            });
        }
    }

})