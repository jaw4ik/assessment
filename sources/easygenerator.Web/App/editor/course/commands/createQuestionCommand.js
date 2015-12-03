import questionsRepository from 'repositories/questionRepository';
import constants from 'constants';
import localizationManager from 'localization/localizationManager';

var getDefaultQuestionTitle = type => {
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
        default:
            return localizationManager.localize('newQuestionTitle');
    }
};

export default class {
    static async execute(sectionId, questionType) {
        var createdQuestion = await questionsRepository.addQuestion(sectionId, { title: getDefaultQuestionTitle(questionType) }, questionType);
        return createdQuestion;
    }
};