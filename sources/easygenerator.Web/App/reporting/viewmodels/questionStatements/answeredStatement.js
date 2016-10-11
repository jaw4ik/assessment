import ko from 'knockout';
import QuestionStatementBase from './questionStatementBase';
import surveyModeExtender from './surveyModeExtender/extender'

export default class extends QuestionStatementBase {
    constructor(statement) {
        super(statement);
        this.hasAnswer = this.lrsStatement.response != null;
        this.answerShown = ko.observable(false);

        if (!!this.isSurvey) {
            surveyModeExtender.call(this);
        }
    }

    showAnswer() {
        this.answerShown(true);
    }

    hideAnswer () {
        this.answerShown(false);
    }
}