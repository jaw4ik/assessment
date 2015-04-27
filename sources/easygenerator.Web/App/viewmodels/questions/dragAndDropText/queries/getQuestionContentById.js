define(['http/httpWrapper'], function (httpWrapper) {

    return {
        execute: function (id) {
            return httpWrapper.post('api/question/draganddrop', { questionId: id });
        }
    }

})