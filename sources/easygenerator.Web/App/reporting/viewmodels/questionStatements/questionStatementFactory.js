import constants from 'constants';
import AnsweredStatement from './answeredStatement';
import ExperiencedStatement from './experiencedStatement';

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