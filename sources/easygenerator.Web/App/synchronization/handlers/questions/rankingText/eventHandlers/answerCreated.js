import guard from 'guard';
import app from 'durandal/app';
import constants from 'constants';
import dataContext from 'dataContext';

export default function (questionId, answer, modifiedOn) {
    guard.throwIfNotString(questionId, 'QuestionId is not a string');
    guard.throwIfNotAnObject(answer, 'Answer is not an object');
    guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

    var question = _.find(dataContext.getQuestions(), function(item) {
        return item.id == questionId;
    });

    guard.throwIfNotAnObject(question, 'Question has not been found');
    question.modifiedOn = new Date(modifiedOn);

    app.trigger(constants.messages.question.rankingText.answerCreatedByCollaborator, questionId, answer.Id, answer.Text);
}