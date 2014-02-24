define(['plugins/http', 'context', 'plugins/router', 'eventManager', 'durandal/app', 'repositories/questionRepository', 'repositories/learningContentRepository'],
    function (http, context, router, eventManager, app, questionRepository, learningContentRepository) {

        var learningContents = [],
            enteredOnPage,
            questionId,
            objectiveId,
            backToQuestions = function () {
                router.navigate('questions');
            },
            activate = function (objectiveId, questionId) {
                var that = this;
                return Q.fcall(function () {
                    that.questionId = questionId;
                    that.objectiveId = objectiveId;
                    that.enteredOnPage = new Date();

                    var question = questionRepository.get(objectiveId, questionId);
                    if (question == null) {
                        router.navigate('404');
                        return;
                    }

                    that.learningContents = [];

                    return learningContentRepository.getCollection(objectiveId, questionId).then(function (items) {
                        that.learningContents = _.sortBy(items, function (item) {
                            return item.index;
                        });
                        
                        window.scroll(0, 0);
                    });
                });
            },

            deactivate = function () {
                var question = questionRepository.get(objectiveId, questionId);
                question.learningContentExperienced(new Date() - this.enteredOnPage);
            };

        return {
            activate: activate,
            deactivate: deactivate,
            learningContents: learningContents,
            backToQuestions: backToQuestions,
            questionId: questionId,
            objectiveId: objectiveId
        };
    }
);