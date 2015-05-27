define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, background) {
            return apiHttpWrapper.post('/api/question/draganddrop/background/update', { questionId: questionId, background: background });
        }
    }

})