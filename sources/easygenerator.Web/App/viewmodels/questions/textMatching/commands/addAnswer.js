define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, key, value) {
            return httpWrapper.post('/api/question/textmatching/answer/create', { questionId: questionId, key: key, value: value });
        }
    }

})