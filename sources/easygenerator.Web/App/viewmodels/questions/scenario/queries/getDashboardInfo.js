define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function () {
            return apiHttpWrapper.post('api/question/scenario/getdashboardinfo');
        }
    }

});