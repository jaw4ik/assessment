define(['repositories/questionRepository', 'localization/localizationManager', 'uiLocker', 'clientContext', 'eventTracker', 'plugins/router', 'constants'],
    function (questionRepository, localizationManager, uiLocker, clientContext, eventTracker, router, constants) {

        return {
            execute: function (sectionId, courseId, questionType, eventCategory) {
                sendActualEvent(questionType, eventCategory);
                uiLocker.lock();
                return questionRepository.addQuestion(sectionId, { title: getActualQuestionName(questionType) }, questionType).then(function (question) {
                    clientContext.set(constants.clientContextKeys.lastCreatedQuestionId, question.id);
                    uiLocker.unlock();

                    router.navigate('courses/' + courseId + '/sections/' + sectionId + '/questions/' + question.id);
                }).fail(function () {
                    uiLocker.unlock();
                });
            }
        };

        function sendActualEvent(questionType, eventCategory) {
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
                    eventTracker.publish('Create new information content', constants.eventCategories.informationContent);
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
        }

        function getActualQuestionName(questionType) {
            switch (questionType) {
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
        }

    }
);