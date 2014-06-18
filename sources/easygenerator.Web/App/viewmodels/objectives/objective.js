define(['dataContext', 'constants', 'eventTracker', 'localization/localizationManager', 'plugins/router', 'repositories/objectiveRepository', 'repositories/courseRepository', 'repositories/questionRepository', 'notify', 'uiLocker', 'clientContext', 'ping', 'models/backButton', 'durandal/app'],
    function(dataContext, constants, eventTracker, localizationManager, router, repository, courseRepository, questionRepository, notify, uiLocker, clientContext, ping, BackButton, app) {
        "use strict";

        var
            events = {
                updateObjectiveTitle: "Update objective title",
                navigateToQuestionEditor: "Navigate to question editor",
                createNewQuestion: "Create new question",
                selectQuestion: "Select question",
                unselectQuestion: "Unselect question",
                deleteSelectedQuestions: "Delete question",
                navigateToCourse: "Navigate to course details",
                navigateToObjectives: "Navigate to objectives",
                changeQuestionsOrder: "Change order of questions"
            },
            viewModel = {
                objectiveId: null,
                title: ko.observable(''),
                titleMaxLength: constants.validation.objectiveTitleMaxLength,
                currentLanguage: '',
                contextCourseId: null,
                contextCourseTitle: null,

                questions: ko.observableArray([]),

                startEditTitle: startEditTitle,
                endEditTitle: endEditTitle,

                navigateToCourseEvent: navigateToCourseEvent,
                navigateToObjectivesEvent: navigateToObjectivesEvent,
                navigateToEditQuestion: navigateToEditQuestion,

                deleteSelectedQuestions: deleteSelectedQuestions,
                toggleQuestionSelection: toggleQuestionSelection,
                isReorderingQuestions: ko.observable(false),
                startReorderingQuestions: startReorderingQuestions,
                updateQuestionsOrder: updateQuestionsOrder,

                canActivate: canActivate,
                activate: activate,

                objectiveTitleUpdated: objectiveTitleUpdated,
                questionsReordered: questionsReordered,
                questionCreatedByCollaborator: questionCreatedByCollaborator,
                questionTitleUpdatedByCollaborator: questionTitleUpdatedByCollaborator,
                questionDeletedByCollaborator: questionDeletedByCollaborator,
                questionUpdated: questionUpdated,

                backButtonData: new BackButton({})
            };

        viewModel.title.isEditing = ko.observable();
        viewModel.title.isValid = ko.computed(function() {
            var length = viewModel.title().trim().length;
            return length > 0 && length <= constants.validation.objectiveTitleMaxLength;
        });

        viewModel.enableDeleteQuestions = ko.computed(function() {
            return getSelectedQuestions().length > 0;
        });

        viewModel.isSortingEnabled = ko.computed(function() {
            return viewModel.questions().length > 1;
        });

        app.on(constants.messages.objective.titleUpdatedByCollaborator, objectiveTitleUpdated);
        app.on(constants.messages.objective.questionsReorderedByCollaborator, questionsReordered);
        app.on(constants.messages.question.createdByCollaborator, questionCreatedByCollaborator);
        app.on(constants.messages.question.titleUpdatedByCollaborator, questionTitleUpdatedByCollaborator);
        app.on(constants.messages.question.deletedByCollaborator, questionDeletedByCollaborator);
        app.on(constants.messages.question.answer.addedByCollaborator, questionUpdated);
        app.on(constants.messages.question.answer.deletedByCollaborator, questionUpdated);
        app.on(constants.messages.question.answer.textUpdatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.answer.correctnessUpdatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.learningContent.createdByCollaborator, questionUpdated);
        app.on(constants.messages.question.learningContent.deletedByCollaborator, questionUpdated);
        app.on(constants.messages.question.learningContent.textUpdatedByCollaborator, questionUpdated);

        return viewModel;

        function objectiveTitleUpdated(objective) {
            if (objective.id != viewModel.objectiveId || viewModel.title.isEditing())
                return;

            viewModel.title(objective.title);
        }

        function startEditTitle() {
            viewModel.title.isEditing(true);
        }

        function endEditTitle() {
            viewModel.title(viewModel.title().trim());
            viewModel.title.isEditing(false);

            var objectiveTitle = null;

            repository.getById(viewModel.objectiveId)
                .then(function(response) {
                    objectiveTitle = response.title;
                    if (viewModel.title() == objectiveTitle)
                        return;

                    eventTracker.publish(events.updateObjectiveTitle);

                    if (viewModel.title.isValid()) {
                        repository.updateObjective({ id: viewModel.objectiveId, title: viewModel.title() }).then(showNotification);
                    } else {
                        viewModel.title(objectiveTitle);
                    }
                });
        }

        function navigateToEditQuestion(question) {
            eventTracker.publish(events.navigateToQuestionEditor);
            if (_.isNullOrUndefined(question)) {
                throw 'Question is null or undefined';
            }

            if (_.isNullOrUndefined(question.id)) {
                throw 'Question id is null or undefined';
            }

            router.navigate(getEditQuestionLink(question.id));
        }

        function deleteSelectedQuestions() {
            eventTracker.publish(events.deleteSelectedQuestions);
            var selectedQuestions = getSelectedQuestions();
            if (selectedQuestions.length == 0)
                throw 'No selected questions to delete';

            var questionIds = _.map(selectedQuestions, function(item) {
                return item.id;
            });

            questionRepository.removeQuestions(viewModel.objectiveId, questionIds)
                .then(function(modifiedOn) {
                    viewModel.questions(_.difference(viewModel.questions(), selectedQuestions));
                    showNotification(modifiedOn);
                });
        }

        function toggleQuestionSelection(question) {
            if (_.isNullOrUndefined(question)) {
                throw 'Question is null or undefined';
            }

            if (!ko.isObservable(question.isSelected)) {
                throw 'Question does not have isSelected observable';
            }

            question.isSelected(!question.isSelected());
            eventTracker.publish(question.isSelected() ? events.selectQuestion : events.unselectQuestion);
        }

        function navigateToCourseEvent() {
            eventTracker.publish(events.navigateToCourse);
        }

        function navigateToObjectivesEvent() {
            eventTracker.publish(events.navigateToObjectives);
        }

        function canActivate() {
            return ping.execute();
        }

        function activate(objId, queryParams) {
            viewModel.currentLanguage = localizationManager.currentLanguage;

            if (_.isNullOrUndefined(queryParams) || !_.isString(queryParams.courseId)) {
                viewModel.contextCourseId = null;
                viewModel.contextCourseTitle = null;

                viewModel.backButtonData.configure({
                    url: 'objectives',
                    backViewName: localizationManager.localize('learningObjectives'),
                    callback: navigateToObjectivesEvent,
                    alwaysVisible: true
                });

                return initObjectiveInfo(objId);
            }

            return courseRepository.getById(queryParams.courseId).then(function(course) {
                viewModel.contextCourseId = course.id;
                viewModel.contextCourseTitle = course.title;

                viewModel.backButtonData.configure({
                    url: 'course/' + course.id,
                    backViewName: '\'' + course.title + '\'',
                    callback: navigateToCourseEvent,
                    alwaysVisible: false
                });

                return initObjectiveInfo(objId);
            }).fail(function(reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });

            function initObjectiveInfo(id) {
                return repository.getById(id).then(function(objective) {
                    clientContext.set('lastVisitedObjective', id);
                    viewModel.objectiveId = objective.id;
                    viewModel.title(objective.title);

                    var array = _.map(objective.questions, mapQuestion);

                    viewModel.questions(array);
                }).fail(function(reason) {
                    router.activeItem.settings.lifecycleData = { redirect: '404' };
                    throw reason;
                });
            }
        }

        function mapQuestion(question) {
            return {
                id: question.id,
                title: ko.observable(question.title),
                modifiedOn: ko.observable(question.modifiedOn),
                isSelected: ko.observable(false),
                editLink: getEditQuestionLink(question.id),
                image: getQuestionImageLink(question.type)
            };
        }

        function getEditQuestionLink(questionId) {
            var queryString = router.activeInstruction().queryString;
            queryString = _.isNullOrUndefined(queryString) ? '' : '?' + queryString;

            return '#objective/' + viewModel.objectiveId + '/question/' + questionId + queryString;
        }

        function getQuestionImageLink(type) {
            switch (type) {
            case constants.questionType.multipleSelect.type:
                return constants.questionType.multipleSelect.image;
            case constants.questionType.fillInTheBlank.type:
                return constants.questionType.fillInTheBlank.image;
            case constants.questionType.dragAndDrop.type:
                return constants.questionType.dragAndDrop.image;
                case constants.questionType.multipleChoice.type:
                    return constants.questionType.multipleChoice.image;
            }
        }

        function getSelectedQuestions() {
            return _.reject(viewModel.questions(), function(item) {
                return !item.isSelected();
            });
        }

        function showNotification() {
            notify.saved();
        }

        function startReorderingQuestions() {
            viewModel.isReorderingQuestions(true);
        }

        function updateQuestionsOrder() {
            eventTracker.publish(events.changeQuestionsOrder);
            viewModel.isReorderingQuestions(false);
            repository.updateQuestionsOrder(viewModel.objectiveId, viewModel.questions())
                .then(function() {
                    showNotification();
                });
        }

        function questionsReordered(objective) {
            if (viewModel.objectiveId != objective.id || viewModel.isReorderingQuestions()) {
                return;
            }

            viewModel.questions(_.chain(objective.questions)
                .map(function(question) {
                    return _.find(viewModel.questions(), function(q) {
                        return q.id == question.id;
                    });
                })
                .value());
        }

        function questionCreatedByCollaborator(objId, question) {
            if (viewModel.objectiveId != objId) {
                return;
            }

            var questions = viewModel.questions();
            questions.push(mapQuestion(question));
            viewModel.questions(questions);
        }

        function questionTitleUpdatedByCollaborator(question) {
            var vmQuestion = _.find(viewModel.questions(), function(q) {
                return q.id == question.id;
            });

            if (_.isNullOrUndefined(vmQuestion)) {
                return;
            }

            vmQuestion.title(question.title);
            vmQuestion.modifiedOn(question.modifiedOn);
        }

        function questionDeletedByCollaborator(objId, questionIds) {
            if (viewModel.objectiveId != objId) {
                return;
            }

            var questions = _.reject(viewModel.questions(), function(item) {
                return _.indexOf(questionIds, item.id) != -1;
            });
            viewModel.questions(questions);
        }

        function questionUpdated(question) {
            var vmQuestion = _.find(viewModel.questions(), function (q) {
                return q.id == question.id;
            });

            if (_.isNullOrUndefined(vmQuestion)) {
                return;
    }

            vmQuestion.modifiedOn(question.modifiedOn);
        }
    }
);