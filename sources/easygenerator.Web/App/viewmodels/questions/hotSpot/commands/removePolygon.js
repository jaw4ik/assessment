define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, polygonId) {
            return httpWrapper.post('/api/question/hotspot/polygon/delete', { questionId: questionId, polygonId: polygonId });
        }
    }

})