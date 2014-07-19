﻿define(['http/httpWrapper'], function (httpWrapper) {
    "use strict";
    return {
        execute: function (answerId, imageUrl) {
            return httpWrapper.post('/api/question/singleselectimage/answer/image/update', { answerId: answerId, imageUrl: imageUrl });
        }
    }

})