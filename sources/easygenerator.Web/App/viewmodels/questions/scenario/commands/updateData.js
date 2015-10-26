define(['http/apiHttpWrapper'], function (apiHttpWrapper) {

    return {
        execute: function (questionId, projectInfo) {
            return apiHttpWrapper.post('api/question/scenario/updatedata', {
                questionId: questionId,
                projectId: projectInfo.permalink,
                embedCode: projectInfo.embed_code,
                embedUrl: projectInfo.embed_url,
                projectArchiveUrl: projectInfo.zip_url
            });
        }
    };

});