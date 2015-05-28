define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, answerId) {
            return apiHttpWrapper.post('/api/question/textmatching/answer/delete', { questionId: questionId, answerId: answerId });
        }
    }

})