define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, dropspotId) {
            return apiHttpWrapper.post('/api/question/draganddrop/dropspot/delete', { questionId: questionId, dropspotId: dropspotId });
        }
    }

})