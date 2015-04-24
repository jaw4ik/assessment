define(['http/httpWrapper'], function (httpWrapper) {
    "use strict";
    return {
        execute: function (questionId, imageUrl) {
            return httpWrapper.post('/api/question/singleselectimage/answer/create', { questionId: questionId, imageUrl: imageUrl });
        }
    }

})