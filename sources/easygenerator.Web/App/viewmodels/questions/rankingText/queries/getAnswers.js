import http from 'http/apiHttpWrapper.js';
import constants from 'constants.js';

export function execute(id) {
    return new Promise((resolve, reject) => {
        http.post(`api/question/${constants.questionType.rankingText.type}/answers`, { questionId: id })
            .then(response => {
                if (response) {
                    resolve(response.answers);
                } else {
                    reject("Failed to load ranking text answers");
                }
            }).fail(reject);
    });
}