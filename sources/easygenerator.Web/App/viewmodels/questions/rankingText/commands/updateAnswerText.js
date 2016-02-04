import http from 'http/apiHttpWrapper.js';
import constants from 'constants.js';

export function execute(answerId, value) {
    return new Promise((resolve, reject) => {
        http.post(`api/question/${constants.questionType.rankingText.type}/answer/updateText`, { rankingTextAnswerId: answerId, value: value })
            .then(resolve)
            .fail(reject);
    });
}