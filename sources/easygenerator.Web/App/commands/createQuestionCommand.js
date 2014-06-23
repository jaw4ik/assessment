define(['repositories/questionRepository', 'localization/localizationManager', 'uiLocker', 'clientContext', 'eventTracker', 'plugins/router', 'constants'],
    function (questionRepository, localizationManager, uiLocker, clientContext, eventTracker, router, constants) {

        return {
            execute: function (objectiveId, courseId, questionType, eventCategory) {
                sendActualEvent(questionType, eventCategory);
                uiLocker.lock();
                return questionRepository.addQuestion(objectiveId, { title: localizationManager.localize('newQuestionTitle') }, questionType).then(function (question) {
                    clientContext.set('lastCreatedQuestionId', question.id);
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
                case constants.questionType.dragAndDrop.type:
                    eventTracker.publish('Create new question (drag and drop)', eventCategory);
                    break;
                case constants.questionType.multipleChoice.type:
                    eventTracker.publish('Create new question (multiple choice)', eventCategory);
                    break;

            }
        }

    }
);