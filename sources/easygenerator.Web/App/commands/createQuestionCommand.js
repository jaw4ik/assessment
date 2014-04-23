define(['repositories/questionRepository', 'localization/localizationManager', 'uiLocker', 'clientContext', 'eventTracker', 'plugins/router'],
    function (questionRepository, localizationManager, uiLocker, clientContext, eventTracker, router) {

        return {
            execute: function (objectiveId, courseId, eventCategory) {
                eventTracker.publish('Create new question', eventCategory);
                uiLocker.lock();
                return questionRepository.addQuestion(objectiveId, { title: localizationManager.localize('newQuestionTitle') }).then(function(question) {
                    clientContext.set('lastCreatedQuestionId', question.id);
                    uiLocker.unlock();

                    var queryString = _.isNullOrUndefined(courseId) ? "" : '?courseId=' + courseId;
                    router.navigate('#objective/' + objectiveId + '/question/' + question.id + queryString);
                }).fail(function() {
                    uiLocker.unlock();
                });
            }
        };

    }
);