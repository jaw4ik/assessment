define(['repositories/questionRepository', 'localization/localizationManager', 'uiLocker', 'clientContext', 'eventTracker', 'plugins/router', 'constants'],
    function (questionRepository, localizationManager, uiLocker, clientContext, eventTracker, router, constants) {

        return {
            execute: function (objectiveId, courseId, questionType, eventCategory) {
                sendActualEvent(questionType, eventCategory);
                uiLocker.lock();
                return questionRepository.addQuestion(objectiveId, { title: getActualQuestionName(questionType) }, questionType).then(function (question) {
                    clientContext.set(constants.clientContextKeys.lastCreatedQuestionId, question.id);
                    uiLocker.unlock();

                    var queryString = _.isNullOrUndefined(courseId) ? "" : '?courseId=' + courseId;
                    router.navigate('#objective/' + objectiveId + '/question/' + question.id + queryString);
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
            }
        }

        function getActualQuestionName(questionType) {
            if (questionType === constants.questionType.informationContent.type) {
                return localizationManager.localize('newInformationContentTitle');
            }
            return localizationManager.localize('newQuestionTitle');
        }

    }
);