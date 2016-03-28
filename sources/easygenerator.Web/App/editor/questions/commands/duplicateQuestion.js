import _ from 'underscore';
import guard from 'guard';
import app from 'durandal/app';
import dataContext from 'dataContext';
import constants from 'constants';
import apiHttpWrapper from 'http/apiHttpWrapper';
import questionModelMapper from 'mappers/questionModelMapper';

let copyQuestion = async (questionId, sectionId) => {
    guard.throwIfNotString(questionId, 'Question id is not a string');
    guard.throwIfNotString(sectionId, 'Section id is not a string');

    let copyResponse = await apiHttpWrapper.post('api/question/copy', { questionId: questionId, sectionId: sectionId });

    guard.throwIfNotAnObject(copyResponse, 'Response is not an object');

    let section = _.find(dataContext.sections, item => item.id === sectionId);
    guard.throwIfNotAnObject(section, 'Section does not exist in dataContext');

    let copiedQuestion = questionModelMapper.map(copyResponse);
    let previousIndex = _.findIndex(section.questions, item => item.id === questionId);

    if (previousIndex === -1 || previousIndex + 1 === section.questions.length) {
        section.questions.push(copiedQuestion);
        section.modifiedOn = copiedQuestion.createdOn;
        app.trigger(constants.messages.question.created, sectionId, copiedQuestion);
        return copiedQuestion;
    }
    
    let index = previousIndex + 1;
    section.questions.splice(index, 0, copiedQuestion);

    let reorderResponse = await apiHttpWrapper.post('api/section/updatequestionsorder', { sectionId: section.id, questions: _.map(section.questions, item => item.id) });

    guard.throwIfNotAnObject(reorderResponse, 'Response is not an object');
    guard.throwIfNotString(reorderResponse.ModifiedOn, 'Response does not have modification date');
    
    section.modifiedOn = new Date(reorderResponse.ModifiedOn);
    app.trigger(constants.messages.question.created, sectionId, copiedQuestion, index);

    return copiedQuestion;
};

export default class {
    static execute(questionId, sectionId) {
        return copyQuestion(questionId, sectionId);
    }
}