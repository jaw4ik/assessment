import http from 'http/apiHttpWrapper';
import localizationManager from 'localization/localizationManager';

export function execute(learningPathId) {
    return new Promise((resolve, reject) => {
        http.get(`/api/learningpath/${learningPathId}?v=${Math.random()}`)
            .then(response => {
                resolve(JSON.parse(response.settings));
            }).fail(() => {
                reject(localizationManager.localize('errorLoadLearningPathSettings'));
            });
    });
}