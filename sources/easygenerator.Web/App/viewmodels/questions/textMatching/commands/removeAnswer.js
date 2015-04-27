define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, answerId) {
            return httpWrapper.post('/api/question/textmatching/answer/delete', { questionId: questionId, answerId: answerId });
        }
    }

})