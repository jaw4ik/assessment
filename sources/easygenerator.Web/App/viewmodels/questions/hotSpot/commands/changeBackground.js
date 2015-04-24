define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, background) {
            return httpWrapper.post('/api/question/hotspot/background/update', { questionId: questionId, background: background });
        }
    }

})