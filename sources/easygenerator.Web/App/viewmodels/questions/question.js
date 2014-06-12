define(['eventTracker', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'ping', 'models/backButton', 'plugins/router',
        'viewmodels/questions/multipleSelect/multipleSelect', 'viewmodels/questions/fillInTheBlank/fillInTheBlank', 'viewmodels/questions/dragAndDrop/dragAndDrop',
        'viewmodels/questions/multipleChoice/multipleChoice'],
    function (eventTracker, constants, questionRepository, objectiveRepository, ping, BackButton, router, multipleSelect, fillInTheBlank, dragAndDrop, multipleChoice) {
        "use strict";
        var
            events = {
                navigateToObjective: 'Navigate to objective details'
            };

        var viewmodel = {
            objectiveId: '',
            questionId: '',
            canActivate: canActivate,
            activate: activate,
            activeScreen: null,
            navigateToObjectiveEvent: navigateToObjectiveEvent,
            backButtonData: new BackButton({})
        };

        return viewmodel;

        function canActivate() {
            return ping.execute();
        }

        function navigateToObjectiveEvent() {
            eventTracker.publish(events.navigateToObjective);
        }

        function activate(objId, quesId, queryParams) {
            viewmodel.objectiveId = objId;
            viewmodel.questionId = quesId;
            return objectiveRepository.getById(objId).then(function (objective) {
                viewmodel.objectiveId = objective.id;
                viewmodel.backButtonData.configure({
                    url: 'objective/' + objective.id,
                    backViewName: '\'' + objective.title + '\'',
                    callback: navigateToObjectiveEvent,
                    alwaysVisible: _.isNullOrUndefined(queryParams) || !_.isString(queryParams.courseId)
                });

                return questionRepository.getById(viewmodel.objectiveId, viewmodel.questionId).then(function (question) {
                    viewmodel.activeScreen = setActiveViewModel(question);
                    return viewmodel.activeScreen.initialize(viewmodel.objectiveId, question);
                });
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        function setActiveViewModel(question) {
            switch (question.type) {
                case constants.questionType.multipleSelect.type:
                    return multipleSelect;
                case constants.questionType.fillInTheBlank.type:
                    return fillInTheBlank;
                case constants.questionType.dragAndDrop.type:
                    return dragAndDrop;
                case constants.questionType.multipleChoice.type:
                    return multipleChoice;
            }
        }
    }
);