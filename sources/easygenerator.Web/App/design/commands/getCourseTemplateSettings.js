import http from 'http/apiHttpWrapper';
import themeModelMapper from 'mappers/themeModelMapper';

export function getCourseTemplateSettings(courseId, templateId) {
    return http.get(`/api/course/${courseId}/template/${templateId}?v=${Math.random()}`)
        .then(response => {
            return {
                settings: JSON.parse(response.settings),
                extraData: JSON.parse(response.extraData),
                theme: response.theme && themeModelMapper.map(response.theme)
            }
        });
}