import http from 'http/apiHttpWrapper.js';
import constants from 'constants.js';

export function execute(id, answers) {
    return new Promise((resolve, reject) => {
        var requestArgs = {
            questionId: id,
            answers: _.map(answers, function (item) {
                return item.id;
            })
        };

        http.post(`api/question/${constants.questionType.rankingText.type}/answers/updateOrder`, requestArgs)
            .then(resolve)
            .fail(reject);
    });
}