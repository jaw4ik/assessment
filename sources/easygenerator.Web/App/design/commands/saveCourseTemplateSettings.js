import http from 'plugins/http';

export function saveCourseTemplateSettings(courseId, templateId, settings, extraData) {
    return new Promise((resolve, reject) => {
        http.post(`/api/course/${courseId}/template/${templateId}`, { settings: JSON.stringify(settings), extraData: JSON.stringify(extraData) }, window.auth.getHeader('api'))
            .then(function(response) {
                if (response) {
                    resolve();
                } else {
                    reject();
                }
            }).fail(() => {
                reject();
            });
    });
}