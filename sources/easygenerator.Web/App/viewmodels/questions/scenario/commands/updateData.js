import apiHttpWrapper from 'http/apiHttpWrapper';
import $ from 'jquery';

const scenarioDisableFocusParameter = '?disable-focus';

export default {
    execute(questionId, projectInfo) {
        return apiHttpWrapper.post('api/question/scenario/updatedata', {
            questionId: questionId,
            projectId: projectInfo.token,
            embedCode: processEmbedCode(projectInfo.embed_code),
            embedUrl: processEmbedUrl(projectInfo.embed_url),
            projectArchiveUrl: projectInfo.zip_url
        });
    }
};

function processEmbedUrl(embedUrl) {
    return embedUrl + scenarioDisableFocusParameter;
}

function processEmbedCode(embedCode) {
    let $embedCode = $(embedCode);

    return $embedCode
        .attr('src', $embedCode.attr('src') + scenarioDisableFocusParameter)
        .get(0).outerHTML;
}