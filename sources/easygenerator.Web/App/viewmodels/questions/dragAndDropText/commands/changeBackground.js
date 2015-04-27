define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, background) {
            return httpWrapper.post('/api/question/draganddrop/background/update', { questionId: questionId, background: background });
        }
    }

})