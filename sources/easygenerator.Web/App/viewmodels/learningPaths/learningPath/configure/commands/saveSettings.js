import http from 'http/apiHttpWrapper';

export function execute(learningPathId, settings) {
    return new Promise((resolve, reject) => {
        http.post(`/api/learningpath/${learningPathId}`, { settings: JSON.stringify(settings) })
            .then(resolve)
            .fail(reject);
    });
}