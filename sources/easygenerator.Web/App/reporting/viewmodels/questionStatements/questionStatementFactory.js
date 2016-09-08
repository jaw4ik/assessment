import constants from 'constants';
import AnsweredStatement from 'reporting/viewmodels/questionStatements/answeredStatement';
import ExperiencedStatement from 'reporting/viewmodels/questionStatements/experiencedStatement';

class QuestionStatementFactory{
    createQuestionStatement(lrsStatement) {
        switch (lrsStatement.verb){
            case constants.reporting.xApiVerbIds.answered:
                return new AnsweredStatement(lrsStatement);
            case constants.reporting.xApiVerbIds.experienced:
                return new ExperiencedStatement(lrsStatement);
            default:
                throw 'Unexpected question statement verb id';
        }
    }
}

export default new QuestionStatementFactory();