import http from 'http/apiHttpWrapper.js';
import constants from 'constants.js';

export function execute(id) {
    return new Promise((resolve, reject) => {
        http.post(`api/question/${constants.questionType.rankingText.type}/answer/add`, { questionId: id })
            .then(resolve)
            .fail(reject);
    });
}