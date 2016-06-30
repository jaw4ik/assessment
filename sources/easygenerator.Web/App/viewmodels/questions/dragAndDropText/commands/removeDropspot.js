import apiHttpWrapper from 'http/apiHttpWrapper';

export default {
    execute: function(questionId, dropspotId) {
        return apiHttpWrapper.post('/api/question/draganddrop/dropspot/delete', { questionId: questionId, dropspotId: dropspotId });
    }
};