import http from 'http/apiHttpWrapper.js';
import constants from 'constants.js';

export function execute(questionId, answerId) {
    return new Promise((resolve, reject) => {
        http.post(`api/question/${constants.questionType.rankingText.type}/answer/delete`, { questionId: questionId, answerId: answerId })
            .then(resolve)
            .fail(reject);
    });
}