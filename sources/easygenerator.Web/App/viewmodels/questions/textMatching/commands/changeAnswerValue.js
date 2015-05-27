define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (id, value) {
            return Q.fcall(function () {
                return apiHttpWrapper.post('/api/question/textmatching/answer/updateValue', { textmatchinganswerId: id, value: value });
            });
        }
    }

})