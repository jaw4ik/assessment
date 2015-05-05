define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (id, key) {
            return Q.fcall(function () {
                return apiHttpWrapper.post('/api/question/textmatching/answer/updateKey', { textmatchinganswerId: id, key: key });
            });
        }
    }

})