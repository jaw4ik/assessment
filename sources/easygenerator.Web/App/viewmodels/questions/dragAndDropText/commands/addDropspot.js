define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, text) {
            return httpWrapper.post('/api/question/draganddrop/dropspot/create', { questionId: questionId, text: text });
        }
    }

})