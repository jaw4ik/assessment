define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (id) {
            return httpWrapper.post('api/question/hotspot', { questionId: id });
        }
    }

})