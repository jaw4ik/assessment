define(['repositories/questionRepository', 'localization/localizationManager', 'uiLocker', 'clientContext', 'plugins/router'], function (questionRepository, localizationManager, uiLocker, clientContext, router) {

    return {
        execute: function (objectiveId, courseId) {
            uiLocker.lock();
            return questionRepository.addQuestion(objectiveId, { title: localizationManager.localize('newQuestionTitle') }).then(function (question) {
                clientContext.set('lastCreatedQuestionId', question.id);
                uiLocker.unlock();
                router.navigate('#objective/' + objectiveId + '/question/' + question.id + '?courseId=' + courseId);
            }).fail(function () {
                uiLocker.unlock();
            });
        }
    };

})