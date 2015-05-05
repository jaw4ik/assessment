define(['http/apiHttpWrapper'], function (apiHttpWrapper) {
    "use strict";
    return {
        execute: function (questionId, answerId) {
            return apiHttpWrapper.post('/api/question/singleselectimage/answer/delete', { questionId: questionId, answerId: answerId });
        }
    }

})