define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, isMultiple) {
            return httpWrapper.post('/api/question/hotspot/type', { questionId: questionId, isMultiple: isMultiple });
        }
    }

})