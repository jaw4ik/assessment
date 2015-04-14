define(['repositories/questionRepository', 'localization/localizationManager', 'uiLocker', 'clientContext', 'eventTracker', 'plugins/router', 'constants'],
    function (questionRepository, localizationManager, uiLocker, clientContext, eventTracker, router, constants) {

        return {
            execute: function (objectiveId, courseId, questionType, eventCategory) {
                sendActualEvent(questionType, eventCategory);
                uiLocker.lock();
                return questionRepository.addQuestion(objectiveId, { title: getActualQuestionName(questionType) }, questionType).then(function (question) {
                    clientContext.set(constants.clientContextKeys.lastCreatedQuestionId, question.id);
                    uiLocker.unlock();

                    var navigateUrl = 'objectives/' + objectiveId + '/questions/' + question.id;

                    if (_.isString(courseId)) {
                        router.navigate('courses/' + courseId + '/' + navigateUrl);
                    } else {
                        router.navigate(navigateUrl);
                    }

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
                case constants.questionType.open.type:
                    eventTracker.publish('Create new question (open)', eventCategory);
                    break;
            }
        }

        function getActualQuestionName(questionType) {
            switch (questionType) {
                case constants.questionType.informationContent.type:
                    return localizationManager.localize('newInformationContentTitle');
                case constants.questionType.statement.type:
                    return localizationManager.localize('newStatementQuestionTitle');
                case constants.questionType.hotspot.type:
                    return localizationManager.localize('newHotspotQuestionTitle');
                case constants.questionType.open.type:
                    return localizationManager.localize('newOpenQuestionTitle');
                default:
                    return localizationManager.localize('newQuestionTitle');
            }
        }

    }
);