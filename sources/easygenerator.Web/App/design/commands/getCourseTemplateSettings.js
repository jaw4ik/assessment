import http from 'http/apiHttpWrapper';

export function getCourseTemplateSettings(courseId, templateId) {
    return http.get(`/api/course/${courseId}/template/${templateId}?v=${Math.random()}`)
        .then(response => {
            return {
                settings: JSON.parse(response.settings),
                extraData: JSON.parse(response.extraData)
            }
        });
}