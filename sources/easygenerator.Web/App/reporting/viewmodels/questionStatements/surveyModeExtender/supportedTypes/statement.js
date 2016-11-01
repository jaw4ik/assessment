import _ from 'underscore';

class StatementAnswers {
    constructor(title, isAnswered, isTrue) {
        this.title = title;
        this.isAnswered = isAnswered;
        this.isTrue = isTrue;
    }
}

export default function() {
    let responseAnswers = this.lrsStatement.response && this.lrsStatement.response.split('[,]');
    let choices = this.lrsStatement.definition.choices;

    this.answers = [];

    if (_.isNullOrUndefined(responseAnswers)) {
        this.answers = _.map(choices, choice => new StatementAnswers(choice.description['en-US'], false, false));
        return;
    }

    responseAnswers = _.map(responseAnswers,
        answer => {
            let temp = answer.split('[.]');
            return {
                id: temp[0],
                value: temp[1] === 'true'
            };
        });

    this.answers = _.map(choices, choice => {
        let answer = _.find(responseAnswers, a => a.id === choice.id);
        if (_.isNullOrUndefined(answer)) {
            return new StatementAnswers(choice.description['en-US'], false, false);
        }
        return new StatementAnswers(choice.description['en-US'], true, answer.value);
    });

    this.csvResponse = _.chain(this.answers).filter(answer => answer.isAnswered).map(answer => `[${answer.isTrue}] ${answer.title}`).value().join('; ');
};