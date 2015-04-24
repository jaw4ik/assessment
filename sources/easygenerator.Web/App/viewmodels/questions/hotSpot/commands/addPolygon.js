define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, points) {
            return httpWrapper.post('/api/question/hotspot/polygon/create', { questionId: questionId, points: JSON.stringify(points) });
        }
    }

})