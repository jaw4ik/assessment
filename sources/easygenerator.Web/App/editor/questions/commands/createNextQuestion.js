import _ from 'underscore';

import app from 'durandal/app';
import QuestionModel from 'models/question';
import dataContext from 'dataContext';
import guard from 'guard';
import constants from 'constants';
import apiHttpWrapper from 'http/apiHttpWrapper';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';

let addQuestion = async (sectionId, title, questionType, currentQuestionId) => {
    guard.throwIfNotString(sectionId, 'Section id is not a string');
    guard.throwIfNotString(title, 'Question data is not an object');

    let createResponse = await apiHttpWrapper.post(`api/question/${questionType}/create`, { sectionId: sectionId, title: title });
            
    guard.throwIfNotAnObject(createResponse, 'Response is not an object');
    guard.throwIfNotString(createResponse.Id, 'Question Id is not a string');
    guard.throwIfNotString(createResponse.CreatedOn, 'Question creation date is not a string');

    let section = _.find(dataContext.sections, item => item.id === sectionId);
    guard.throwIfNotAnObject(section, 'Section does not exist in dataContext');

    let createdOn = new Date(createResponse.CreatedOn);
    let createdQuestion = new QuestionModel({
        id: createResponse.Id,
        title: title,
        createdOn: createdOn,
        modifiedOn: createdOn,
        type: questionType
    });

    section.modifiedOn = createdOn;

    let previousIndex = _.findIndex(section.questions, item => item.id === currentQuestionId);

    if (previousIndex === -1 || previousIndex + 1 === section.questions.length) {
        section.questions.push(createdQuestion);
        app.trigger(constants.messages.question.created, sectionId, createdQuestion);
        return createdQuestion;
    }

    let index = previousIndex + 1;
    section.questions.splice(index, 0, createdQuestion);

    let reorderResponse = await apiHttpWrapper.post('api/section/updatequestionsorder', { sectionId: section.id, questions: _.map(section.questions, item => item.id) });

    guard.throwIfNotAnObject(reorderResponse, 'Response is not an object');
    guard.throwIfNotString(reorderResponse.ModifiedOn, 'Response does not have modification date');

    section.modifiedOn = new Date(reorderResponse.ModifiedOn);

    app.trigger(constants.messages.question.created, sectionId, createdQuestion, index);

    return createdQuestion;
};

let getDefaultQuestionTitle = type => {
    switch (type) {
        case constants.questionType.multipleSelect.type:
            return localizationManager.localize('newMultipleChoiceQuestionTitle');
        case constants.questionType.fillInTheBlank.type:
            return localizationManager.localize('newFillInTheBlanksQuestionTitle');
        case constants.questionType.dragAndDropText.type:
            return localizationManager.localize('newDragAndDropTextQuestionTitle');
        case constants.questionType.hotspot.type:
            return localizationManager.localize('newHotspotQuestionTitle');
        case constants.questionType.singleSelectText.type:
            return localizationManager.localize('newSingleChoiceTextQuestionTitle');
        case constants.questionType.singleSelectImage.type:
            return localizationManager.localize('newSingleChoiceImageQuestionTitle');
        case constants.questionType.informationContent.type:
            return localizationManager.localize('newInformationContentTitle');
        case constants.questionType.textMatching.type:
            return localizationManager.localize('newTextMatchingQuestionTitle');
        case constants.questionType.statement.type:
            return localizationManager.localize('newStatementQuestionTitle');
        case constants.questionType.openQuestion.type:
            return localizationManager.localize('newOpenQuestionTitle');
        case constants.questionType.scenario.type:
            return localizationManager.localize('newScenarioQuestionTitle');
        case constants.questionType.rankingText.type:
            return localizationManager.localize('newRankingTextQuestionTitle');
        default:
            return localizationManager.localize('newQuestionTitle');
    }
};
let sendActualEvent = (questionType, eventCategory) => {
    switch (questionType) {
    case constants.questionType.multipleSelect.type:
        eventTracker.publish('Create new question (multiple select)', eventCategory);
        break;
    case constants.questionType.fillInTheBlank.type:
        eventTracker.publish('Create new question (fill in the blanks)', eventCategory);
        break;
    case constants.questionType.dragAndDropText.type:
        eventTracker.publish('Create new question (drag and drop)', eventCategory);
        break;
    case constants.questionType.hotspot.type:
        eventTracker.publish('Create new question (hotspot)', eventCategory);
        break;
    case constants.questionType.singleSelectText.type:
        eventTracker.publish('Create new question (single select text)', eventCategory);
        break;
    case constants.questionType.singleSelectImage.type:
        eventTracker.publish('Create new question (single select image)', eventCategory);
        break;
    case constants.questionType.informationContent.type:
        eventTracker.publish('Create new information content', eventCategory);
        break;
    case constants.questionType.textMatching.type:
        eventTracker.publish('Create new question (text matching)', eventCategory);
        break;
    case constants.questionType.statement.type:
        eventTracker.publish('Create new question (statement)', eventCategory);
        break;
    case constants.questionType.openQuestion.type:
        eventTracker.publish('Create new question (open question)', eventCategory);
        break;
    case constants.questionType.scenario.type:
        eventTracker.publish('Create new question (scenario)', eventCategory);
        break;
    case constants.questionType.rankingText.type:
        eventTracker.publish('Create new question (ranking text)', eventCategory);
        break;
    }
};

export default class {
    static execute(sectionId, questionType, eventCategory, currentQuestionId) {
        sendActualEvent(questionType, eventCategory);
        return addQuestion(sectionId, getDefaultQuestionTitle(questionType), questionType, currentQuestionId);
    }
};