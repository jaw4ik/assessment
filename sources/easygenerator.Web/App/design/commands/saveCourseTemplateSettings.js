import http from 'plugins/http';

export function saveCourseTemplateSettings(courseId, templateId, settings, extraData) {
    return new Promise((resolve, reject) => {
        window.auth.getHeader('api').then(value => {
            http.post(`/api/course/${courseId}/template/${templateId}`, { settings: JSON.stringify(settings), extraData: JSON.stringify(extraData) }, value)
            .then(function(response) {
                if (response) {
                    resolve();
                } else {
                    reject();
                }
            }).fail(() => {
                reject();
            });
        }).fail(() => {
            reject();
        });
    });
}