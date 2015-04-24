define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (id, value) {
            return Q.fcall(function () {
                return httpWrapper.post('/api/question/textmatching/answer/updateValue', { textmatchinganswerId: id, value: value });
            });
        }
    }

})