define(['http/apiHttpWrapper'], function (apiHttpWrapper) {
    "use strict";
    return {
        execute: function (questionId, answerId) {
            return apiHttpWrapper.post('/api/question/singleselectimage/setCorrectAnswer', { questionId: questionId, answerId: answerId });
        }
    }

})