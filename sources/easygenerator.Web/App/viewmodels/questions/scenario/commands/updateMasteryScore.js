define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, masteryScore) {
            return apiHttpWrapper.post('api/question/scenario/updatemasteryscore', { questionId: questionId, masteryScore: masteryScore });
        }
    };

});