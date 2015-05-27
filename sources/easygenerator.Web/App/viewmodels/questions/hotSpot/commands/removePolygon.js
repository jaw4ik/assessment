define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, polygonId) {
            return apiHttpWrapper.post('/api/question/hotspot/polygon/delete', { questionId: questionId, polygonId: polygonId });
        }
    }

})