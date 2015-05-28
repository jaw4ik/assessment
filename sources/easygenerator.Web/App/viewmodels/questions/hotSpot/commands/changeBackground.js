define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, background) {
            return apiHttpWrapper.post('/api/question/hotspot/background/update', { questionId: questionId, background: background });
        }
    }

})