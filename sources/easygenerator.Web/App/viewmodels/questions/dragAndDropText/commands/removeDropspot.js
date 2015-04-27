define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (questionId, dropspotId) {
            return httpWrapper.post('/api/question/draganddrop/dropspot/delete', { questionId: questionId, dropspotId: dropspotId });
        }
    }

})