define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, text) {
            return apiHttpWrapper.post('/api/question/draganddrop/dropspot/create', { questionId: questionId, text: text });
        }
    }

})