define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (id) {
            return apiHttpWrapper.post('api/question/textmatching/answers', { questionId: id });
        }
    }

})