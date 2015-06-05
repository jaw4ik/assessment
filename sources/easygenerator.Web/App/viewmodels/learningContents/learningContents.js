define(['knockout', 'repositories/learningContentRepository', 'repositories/questionRepository', 'localization/localizationManager',
        'notify', 'constants', 'eventTracker', 'durandal/app', 'viewmodels/learningContents/learningContentsViewModelFactory', 'plugins/router'],
    function (ko, learningContentsrepository, questionRepository, localizationManager,
            notify, constants, eventTracker, app, learningContentsViewModelFactory, router) {

        var
            events = {
                changeLearningContentsOrder: 'Change order of Learning Contents'
            };

        var viewModel = {
            autosaveInterval: constants.autosaveTimersInterval.learningContent,
            learningContents: ko.observableArray([]),
            questionId: null,
            questionType: null,

            eventTracker: eventTracker,

            isAddedButtonsShown: ko.observable(false),
            toggleIsAddedButtonsShown: toggleIsAddedButtonsShown,
            addContent: addContent,
            addHotspotOnAnImage: addHotspotOnAnImage,

            updateOrder: updateOrder,
            startReordering: startReordering,
            stopReordering: stopReordering,
            learningContentsReorderedByCollaborator: learningContentsReorderedByCollaborator,

            createdByCollaborator: createdByCollaborator,
            deletedByCollaborator: deletedByCollaborator,
            textUpdatedByCollaborator: textUpdatedByCollaborator,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            activate: activate,
            localizationManager: localizationManager
        };

        viewModel.isSortingEnabled = ko.computed(function () {
            return viewModel.learningContents().length > 1;
        });

        viewModel.orderInProcess = false;
        viewModel.changesFromCollaborator = null;

        app.on(constants.messages.question.learningContent.createdByCollaborator, createdByCollaborator);
        app.on(constants.messages.question.learningContent.deletedByCollaborator, deletedByCollaborator);
        app.on(constants.messages.question.learningContent.textUpdatedByCollaborator, textUpdatedByCollaborator);
        app.on(constants.messages.question.learningContentsReorderedByCollaborator, learningContentsReorderedByCollaborator);
        app.on(constants.messages.question.learningContent.remove, removeLearningContent);

        return viewModel;

        function activate(activationData) {
            if (_.isNullOrUndefined(router.routeData().questionId)) {
                return Q.fcall(function () { });
            }

            var questionId = activationData.questionId;
            var questionType = activationData.questionType;

            return learningContentsrepository.getCollection(questionId).then(function (learningContentsList) {
                viewModel.questionId = questionId;
                viewModel.questionType = questionType;
                viewModel.learningContents([]);
                viewModel.isExpanded(true);
                viewModel.isAddedButtonsShown(false);

                _.each(learningContentsList, doAddLearningContent);
            });
        }

        function addContent() {
            toggleIsAddedButtonsShown();
            addLearnignContent(constants.learningContentsTypes.content, true);
        }

        function addHotspotOnAnImage() {
            addLearnignContent(constants.learningContentsTypes.hotspot, false);
        }

        function addLearnignContent(type, canBeAddedImmediately) {
            doAddLearningContent(undefined, type, canBeAddedImmediately);
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function doAddLearningContent(learningContent, type, canBeAddedImmediately) {
            learningContent = learningContent || { type: type || constants.learningContentsTypes.content };
            var createdLearningContent = new learningContentsViewModelFactory[learningContent.type](learningContent, viewModel.questionId, viewModel.questionType, canBeAddedImmediately);
            if (createdLearningContent.canBeAdded()) {
                viewModel.learningContents.push(createdLearningContent);
            } else {
                var subscribtion = createdLearningContent.canBeAdded.subscribe(function () {
                    if (createdLearningContent.canBeAdded()) {
                        toggleIsAddedButtonsShown();
                        viewModel.learningContents.push(createdLearningContent);
                        subscribtion.dispose();
                    }
                });
            }
        }

        function removeLearningContent(learningContent){
            viewModel.learningContents.remove(learningContent);
        }

        function toggleIsAddedButtonsShown() {
            viewModel.isAddedButtonsShown(!viewModel.isAddedButtonsShown());
        }

        /*#region collaboration*/

        function deletedByCollaborator(question, learningContentId) {
            if (question.id != viewModel.questionId) {
                return;
            }

            var deletedLearningContent = _.find(viewModel.learningContents(), function (item) {
                return item.id() == learningContentId;
            });

            if (_.isNullOrUndefined(deletedLearningContent)) {
                return;
            }

            if (deletedLearningContent.hasFocus()) {
                deletedLearningContent.isDeleted = true;
                notify.error(localizationManager.localize('learningContentHasBeenDeletedByCollaborator'));
            } else {
                viewModel.learningContents.remove(deletedLearningContent);
            }
        }

        function textUpdatedByCollaborator(question, learningContent) {
            if (question.id != viewModel.questionId) {
                return;
            }

            var updatedLearningContent = _.find(viewModel.learningContents(), function (item) {
                return item.id() == learningContent.id;
            });

            if (_.isNullOrUndefined(updatedLearningContent)) {
                return;
            }

            updatedLearningContent.originalText = learningContent.text;
            if (!updatedLearningContent.hasFocus()) {
                updatedLearningContent.text(learningContent.text);
                app.trigger(constants.messages.question.learningContent.updateText, learningContent);
            }
        }

        function createdByCollaborator(question, learningContent) {
            if (question.id != viewModel.questionId) {
                return;
            }

            doAddLearningContent(learningContent);
        }

        function learningContentsReorderedByCollaborator(question, learningContentsIds) {
            if (viewModel.questionId != question.id) {
                return;
            }

            if (viewModel.orderInProcess) {
                viewModel.changesFromCollaborator = {
                    question: question, learningContentsIds: learningContentsIds
                };
                return;
            }

            reorderLearningContents(learningContentsIds);
        }

        /*#endregion collaboration*/

        /*#region ordering*/

        function startReordering() {
            viewModel.orderInProcess = true;
        }

        function stopReordering() {
            viewModel.orderInProcess = false;
            if (viewModel.changesFromCollaborator && viewModel.questionId == viewModel.changesFromCollaborator.question.id) {
                reorderLearningContents(viewModel.changesFromCollaborator.learningContentsIds);
            }
            viewModel.changesFromCollaborator = null;
        }

        function updateOrder() {
            eventTracker.publish(events.changeLearningContentsOrder);
            questionRepository.updateLearningContentsOrder(viewModel.questionId, viewModel.learningContents()).then(function () {
                notify.saved();
            });
            viewModel.changesFromCollaborator = null;
        }

        function reorderLearningContents(learningContentsIds) {
            viewModel.learningContents(_.chain(learningContentsIds)
               .map(function (id) {
                   return _.find(viewModel.learningContents(), function (learningContent) {
                       return id == learningContent.id();
                   });
               })
               .value());
        }

        /*#endregion ordering*/

    }
);
