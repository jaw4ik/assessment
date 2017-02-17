define(['dataContext', 'constants', 'eventTracker', 'localization/localizationManager', 'routing/router', 'repositories/sectionRepository', 'repositories/courseRepository',
    'repositories/questionRepository', 'notify', 'uiLocker', 'clientContext', 'durandal/app', 'images/commands/upload', 'userContext'],
    function (dataContext, constants, eventTracker, localizationManager, router, repository, courseRepository,
        questionRepository, notify, uiLocker, clientContext, app, uploadImage, userContext) {
        "use strict";

        var
            events = {
                updateSectionTitle: "Update objective title",
                navigateToQuestionEditor: "Navigate to question editor",
                createNewQuestion: "Create new question",
                selectQuestion: "Select question",
                unselectQuestion: "Unselect question",
                deleteSelectedQuestions: "Delete question",
                navigateToCourse: "Navigate to course details",
                navigateToSections: "Navigate to objectives",
                changeQuestionsOrder: "Change order of questions",
                openChangeSectionImageDialog: "Open \"change objective image\" dialog",
                changeSectionImage: "Change objective image",
                collapseSectionHint: 'Collapse \"Learning objective hint\"',
                expandSectionHint: 'Expand \"Learning objective hint\"'
            },
            viewModel = {
                courseId: null,
                sectionId: null,
                title: ko.observable(''),
                titleMaxLength: constants.validation.sectionTitleMaxLength,
                imageUrl: ko.observable(''),
                isImageLoading: ko.observable(false),
                currentLanguage: '',

                isLastCreatedSection: false,
                isSectionTipVisible: ko.observable(false),

                showSectionTip: showSectionTip,
                hideSectionTip: hideSectionTip,

                questions: ko.observableArray([]),

                updateImage: updateImage,
                startEditTitle: startEditTitle,
                endEditTitle: endEditTitle,

                navigateToCourseEvent: navigateToCourseEvent,
                navigateToSectionsEvent: navigateToSectionsEvent,
                navigateToEditQuestion: navigateToEditQuestion,

                deleteSelectedQuestions: deleteSelectedQuestions,
                toggleQuestionSelection: toggleQuestionSelection,
                isReorderingQuestions: ko.observable(false),
                startReorderingQuestions: startReorderingQuestions,
                endReorderingQuestions: endReorderingQuestions,
                updateQuestionsOrder: updateQuestionsOrder,
                isQuestionsListReorderedByCollaborator: ko.observable(false),


                canActivate: canActivate,
                activate: activate,

                back: back,

                sectionTitleUpdated: sectionTitleUpdated,
                sectionImageUrlUpdated: sectionImageUrlUpdated,
                questionsReordered: questionsReordered,
                questionCreatedByCollaborator: questionCreatedByCollaborator,
                questionTitleUpdatedByCollaborator: questionTitleUpdatedByCollaborator,
                questionDeletedByCollaborator: questionDeletedByCollaborator,
                questionUpdated: questionUpdated
            };

        viewModel.title.isEditing = ko.observable();
        viewModel.title.isValid = ko.computed(function () {
            var length = viewModel.title().trim().length;
            return length > 0 && length <= constants.validation.sectionTitleMaxLength;
        });

        viewModel.enableDeleteQuestions = ko.computed(function () {
            return getSelectedQuestions().length > 0;
        });

        viewModel.isSortingEnabled = ko.computed(function () {
            return viewModel.questions().length > 1;
        });

        app.on(constants.messages.section.titleUpdatedByCollaborator, sectionTitleUpdated);
        app.on(constants.messages.section.imageUrlUpdatedByCollaborator, sectionImageUrlUpdated);
        app.on(constants.messages.section.questionsReorderedByCollaborator, questionsReordered);
        app.on(constants.messages.question.createdByCollaborator, questionCreatedByCollaborator);
        app.on(constants.messages.question.titleUpdatedByCollaborator, questionTitleUpdatedByCollaborator);
        app.on(constants.messages.question.deletedByCollaborator, questionDeletedByCollaborator);
        app.on(constants.messages.question.answer.addedByCollaborator, questionUpdated);
        app.on(constants.messages.question.answer.deletedByCollaborator, questionUpdated);
        app.on(constants.messages.question.answer.textUpdatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.answer.answerCorrectnessUpdatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.learningContent.createdByCollaborator, questionUpdated);
        app.on(constants.messages.question.learningContent.deletedByCollaborator, questionUpdated);
        app.on(constants.messages.question.learningContent.updatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.dragAndDropText.dropspotCreatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.dragAndDropText.dropspotDeletedByCollaborator, questionUpdated);
        app.on(constants.messages.question.textMatching.answerCreatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.textMatching.answerDeletedByCollaborator, questionUpdated);
        app.on(constants.messages.question.singleSelectImage.answerCreatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.singleSelectImage.answerDeletedByCollaborator, questionUpdated);
        app.on(constants.messages.question.hotSpot.polygonCreatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.hotSpot.polygonDeletedByCollaborator, questionUpdated);
        app.on(constants.messages.question.hotSpot.polygonUpdatedByCollaborator, questionUpdated);
        app.on(constants.messages.question.hotSpot.isMultipleUpdatedByCollaborator, questionUpdated);

        return viewModel;

        function sectionTitleUpdated(section) {
            if (section.id != viewModel.sectionId || viewModel.title.isEditing())
                return;

            viewModel.title(section.title);
        }

        function sectionImageUrlUpdated(section) {
            if (section.id != viewModel.sectionId)
                return;

            viewModel.imageUrl(section.image);
        }

        function updateImage(file) {
            eventTracker.publish(events.openChangeSectionImageDialog);
            viewModel.isImageLoading(true);
            return uploadImage.execute(file)
                .then(function (image) {
                    return repository.updateImage(viewModel.sectionId, image.url).then(function (result) {
                        viewModel.imageUrl(result.imageUrl);
                        viewModel.isImageLoading(false);
                        eventTracker.publish(events.changeSectionImage);
                        showNotification();
                    });
                }).catch(function (reason) {
                    viewModel.isImageLoading(false);
                    notify.error(reason);
                });
        }

        function startEditTitle() {
            viewModel.title.isEditing(true);
        }

        function endEditTitle() {
            viewModel.title(viewModel.title().trim());
            viewModel.title.isEditing(false);

            var sectionTitle = null;

            repository.getById(viewModel.sectionId)
                .then(function (response) {
                    sectionTitle = response.title;
                    if (viewModel.title() == sectionTitle)
                        return;

                    eventTracker.publish(events.updateSectionTitle);

                    if (viewModel.title.isValid()) {
                        repository.updateTitle(viewModel.sectionId, viewModel.title()).then(showNotification);
                    } else {
                        viewModel.title(sectionTitle);
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

            var questionIds = _.map(selectedQuestions, function (item) {
                return item.id;
            });

            questionRepository.removeQuestions(viewModel.sectionId, questionIds)
                .then(function (modifiedOn) {
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

        function navigateToSectionsEvent() {
            eventTracker.publish(events.navigateToSections);
        }

        function back() {
            if (viewModel.courseId) {
                router.navigate('#courses/' + viewModel.courseId);
            } else {
                router.navigate('#library/sections');
            }
        }

        function canActivate() {            
            var promises = [];
            if (arguments.length === 2) {
                promises.push(courseRepository.getById(arguments[0]));
                promises.push(repository.getById(arguments[1]));
            } else {
                promises.push(repository.getById(arguments[0]));
            }

            return Q.all(promises).then(function () {
                return true;
            }).catch(function () {
                return { redirect: '404' };
            });
        }

        function activate() {
            if (arguments.length === 1) {
                viewModel.courseId = null;
                viewModel.sectionId = arguments[0];
            } else if (arguments.length === 2) {
                viewModel.courseId = arguments[0];
                viewModel.sectionId = arguments[1];
            }

            return repository.getById(viewModel.sectionId).then(function (section) {
                clientContext.set(constants.clientContextKeys.lastVisitedSection, viewModel.sectionId);

                viewModel.title(section.title);
                viewModel.imageUrl(section.image);
                viewModel.questions(_.map(section.questions, mapQuestion));

                viewModel.currentLanguage = localizationManager.currentLanguage;
                viewModel.isSectionTipVisible(false);

                var lastCreatedSectionId = clientContext.get(constants.clientContextKeys.lastCreatedSectionId) || '';
                clientContext.remove(constants.clientContextKeys.lastCreatedSectionId);
                viewModel.isLastCreatedSection = lastCreatedSectionId === viewModel.sectionId;
            });
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
            if (viewModel.courseId) {
                return '#courses/' + viewModel.courseId + '/sections/' + viewModel.sectionId + '/questions/' + questionId;
            } else {
                return '#library/sections/' + viewModel.sectionId + '/questions/' + questionId;
            }

        }

        function getQuestionImageLink(type) {
            return constants.questionType[type].image;
        }

        function getSelectedQuestions() {
            return _.reject(viewModel.questions(), function (item) {
                return !item.isSelected();
            });
        }

        function showNotification() {
            notify.saved();
        }

        function startReorderingQuestions() {
            viewModel.isReorderingQuestions(true);
        }

        function endReorderingQuestions() {

            return Q.fcall(function () {
                if (!viewModel.isReorderingQuestions() || !viewModel.isQuestionsListReorderedByCollaborator()) {
                    viewModel.isReorderingQuestions(false);
                    return;
                }

                viewModel.isReorderingQuestions(false);
                viewModel.isQuestionsListReorderedByCollaborator(false);

                return repository.getById(viewModel.id).then(function (section) {
                    reorderConnectedQuestionsList(section);
                });
            });
        }

        function updateQuestionsOrder() {
            eventTracker.publish(events.changeQuestionsOrder);
            viewModel.isReorderingQuestions(false);
            repository.updateQuestionsOrder(viewModel.sectionId, viewModel.questions())
                .then(function () {
                    showNotification();
                });
        }

        function questionsReordered(section) {
            if (viewModel.sectionId != section.id || viewModel.isReorderingQuestions()) {
                viewModel.isQuestionsListReorderedByCollaborator(true);
                return;
            }

            reorderConnectedQuestionsList(section);
        }

        function reorderConnectedQuestionsList(section) {
            viewModel.questions(_.chain(section.questions)
               .map(function (question) {
                   return _.find(viewModel.questions(), function (q) {
                       return q.id == question.id;
                   });
               })
               .value());
        }

        function questionCreatedByCollaborator(objId, question) {
            if (viewModel.sectionId != objId) {
                return;
            }

            var questions = viewModel.questions();
            questions.push(mapQuestion(question));
            viewModel.questions(questions);
        }

        function questionTitleUpdatedByCollaborator(question) {
            var vmQuestion = _.find(viewModel.questions(), function (q) {
                return q.id == question.id;
            });

            if (_.isNullOrUndefined(vmQuestion)) {
                return;
            }

            vmQuestion.title(question.title);
            vmQuestion.modifiedOn(question.modifiedOn);
        }

        function questionDeletedByCollaborator(objId, questionIds) {
            if (viewModel.sectionId != objId) {
                return;
            }

            var questions = _.reject(viewModel.questions(), function (item) {
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

        function showSectionTip() {
            eventTracker.publish(events.expandSectionHint);
            viewModel.isSectionTipVisible(true);
        }

        function hideSectionTip() {
            eventTracker.publish(events.collapseSectionHint);
            viewModel.isSectionTipVisible(false);
        }
    }
);