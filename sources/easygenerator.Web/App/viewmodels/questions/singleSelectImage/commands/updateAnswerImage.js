define(['http/apiHttpWrapper'], function (apiHttpWrapper) {
    "use strict";
    return {
        execute: function (answerId, imageUrl) {
            return apiHttpWrapper.post('/api/question/singleselectimage/answer/image/update', { singleSelectImageAnswerId: answerId, imageUrl: imageUrl });
        }
    }

})