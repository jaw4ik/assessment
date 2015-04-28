define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId) {
            return httpWrapper.post('/api/question/textmatching/answer/create', { questionId: questionId });
        }
    }

})