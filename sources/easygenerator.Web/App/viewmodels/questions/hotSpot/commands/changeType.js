define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, isMultiple) {
            return apiHttpWrapper.post('/api/question/hotspot/type', { questionId: questionId, isMultiple: isMultiple });
        }
    }

})