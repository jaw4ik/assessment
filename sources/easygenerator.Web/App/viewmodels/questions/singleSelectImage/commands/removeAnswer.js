define(['http/httpWrapper'], function (httpWrapper) {
    "use strict";
    return {
        execute: function (questionId, answerId) {
            return httpWrapper.post('/api/question/singleselectimage/answer/delete', { questionId: questionId, answerId: answerId });
        }
    }

})