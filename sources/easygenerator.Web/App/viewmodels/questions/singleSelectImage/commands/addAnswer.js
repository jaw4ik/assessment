define(['http/apiHttpWrapper'], function (apiHttpWrapper) {
    "use strict";
    return {
        execute: function (questionId, imageUrl) {
            return apiHttpWrapper.post('/api/question/singleselectimage/answer/create', { questionId: questionId, imageUrl: imageUrl });
        }
    }

})