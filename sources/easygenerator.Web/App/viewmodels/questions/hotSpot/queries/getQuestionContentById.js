define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (id) {
            return apiHttpWrapper.post('api/question/hotspot', { questionId: id });
        }
    }

})