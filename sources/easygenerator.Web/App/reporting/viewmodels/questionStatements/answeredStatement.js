import ko from 'knockout';
import QuestionStatementBase from './questionStatementBase';

export default class extends QuestionStatementBase {
    constructor(statement) {
        super(statement);
        this.hasAnswer = this.lrsStatement.response != null;
        this.answerShown = ko.observable(false);
    }

    showAnswer() {
        this.answerShown(true);
    }

    hideAnswer () {
        this.answerShown(false);
    }
}