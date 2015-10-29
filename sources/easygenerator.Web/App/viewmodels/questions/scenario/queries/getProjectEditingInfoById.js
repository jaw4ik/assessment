define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (projectId) {
            return apiHttpWrapper.post('api/question/scenario/getprojecteditinginfo', { projectId: projectId });
        }
    }

});