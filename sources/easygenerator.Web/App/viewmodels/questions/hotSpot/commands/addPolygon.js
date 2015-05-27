define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, points) {
            return apiHttpWrapper.post('/api/question/hotspot/polygon/create', { questionId: questionId, points: JSON.stringify(points) });
        }
    }

})