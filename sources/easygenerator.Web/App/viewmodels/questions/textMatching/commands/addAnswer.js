define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId) {
            return apiHttpWrapper.post('/api/question/textmatching/answer/create', { questionId: questionId });
        }
    }

})