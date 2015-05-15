define(['repositories/learningContentRepository', 'repositories/questionRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app',
    'imageUpload', 'uiLocker', 'viewmodels/learningContents/components/hotspotParser'],
    function (learningContentsrepository, questionRepository, localizationManager, notify, constants, eventTracker, app, imageUpload, uiLocker, hotspotParser) {

        var
            events = {
                addLearningContent: 'Add learning content',
                deleteLearningContent: 'Delete learning content',
                beginEditText: 'Start editing learning content',
                endEditText: 'End editing learning content',
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
            addLearningContent: addLearningContent,
            addHotspotOnImage: addHotspotOnImage,
            removeLearningContent: removeLearningContent,

            updateOrder: updateOrder,
            startReordering: startReordering,
            stopReordering: stopReordering,
            learningContentsReorderedByCollaborator: learningContentsReorderedByCollaborator,

            createdByCollaborator: createdByCollaborator,
            deletedByCollaborator: deletedByCollaborator,
            textUpdatedByCollaborator: textUpdatedByCollaborator,

            updateText: updateText,
            beginEditText: beginEditText,
            endEditText: endEditText,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            activate: activate,
            localizationManager: localizationManager
        };

        viewModel.isSortingEnabled = ko.computed(function () {
            return viewModel.learningContents().length > 1;
        });

        viewModel.orderInProcess = false,
            viewModel.changesFromCollaborator = null;

        app.on(constants.messages.question.learningContent.createdByCollaborator, createdByCollaborator);
        app.on(constants.messages.question.learningContent.deletedByCollaborator, deletedByCollaborator);
        app.on(constants.messages.question.learningContent.textUpdatedByCollaborator, textUpdatedByCollaborator);
        app.on(constants.messages.question.learningContentsReorderedByCollaborator, learningContentsReorderedByCollaborator);

        return viewModel;

        function toggleIsAddedButtonsShown() {
            viewModel.isAddedButtonsShown(!viewModel.isAddedButtonsShown());
        }

        function addLearningContent() {
            publishActualEvent(events.addLearningContent);
            doAddLearningContent();
            toggleIsAddedButtonsShown();
        }

        function addHotspotOnImage() {
            publishActualEvent(events.addLearningContent);
            toggleIsAddedButtonsShown();
            imageUpload.upload({
                startLoading: function () {
                    uiLocker.lock();
                },
                success: function (url) {
                    var text = hotspotParser.getHotspot(url);
                    doAddLearningContent(undefined, text);
                },
                complete: function () {
                    uiLocker.unlock();
                }
            });
        }

        function removeLearningContent(learningContent) {
            publishActualEvent(events.deleteLearningContent);

            if (!_.isNullOrUndefined(learningContent.isDeleted) && learningContent.isDeleted) {
                viewModel.learningContents.remove(learningContent);
                return;
            }

            performActionWhenLearningContentIdIsSet(learningContent, function () {
                viewModel.learningContents.remove(learningContent);
                learningContentsrepository.removeLearningContent(viewModel.questionId, ko.unwrap(learningContent.id)).then(function (response) {
                    showNotification(response.modifiedOn);
                });
            });
        }

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
                showNotification();
            });
            viewModel.changesFromCollaborator = null;
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

        function reorderLearningContents(learningContentsIds) {
            viewModel.learningContents(_.chain(learningContentsIds)
               .map(function (id) {
                   return _.find(viewModel.learningContents(), function (learningContent) {
                       return id == learningContent.id();
                   });
               })
               .value());
        }

        function beginEditText() {
            publishActualEvent(events.beginEditText);
        }

        function endEditText(learningContent) {
            publishActualEvent(events.endEditText);

            if (!_.isNullOrUndefined(learningContent.isDeleted) && learningContent.isDeleted) {
                viewModel.learningContents.remove(learningContent);
                return;
            }

            var id = ko.unwrap(learningContent.id);
            var text = ko.unwrap(learningContent.text);

            if (_.isEmptyHtmlText(text)) {
                viewModel.learningContents.remove(learningContent);
                if (!_.isEmptyOrWhitespace(id)) {
                    learningContentsrepository.removeLearningContent(viewModel.questionId, id).then(function (modifiedOn) {
                        showNotification(modifiedOn);
                    });
                }
            }
        }

        function updateText(learningContent) {
            var id = ko.unwrap(learningContent.id);
            var text = ko.unwrap(learningContent.text);

            if (_.isEmptyHtmlText(text) || ((!_.isNullOrUndefined(learningContent.isDeleted) && learningContent.isDeleted))) {
                return;
            }

            if (_.isEmptyOrWhitespace(id)) {
                learningContentsrepository.addLearningContent(viewModel.questionId, { text: text }).then(function (item) {
                    learningContent.id(item.id);
                    learningContent.originalText = text;
                    showNotification(item.createdOn);
                });
            } else {
                if (text != learningContent.originalText) {
                    learningContentsrepository.updateText(viewModel.questionId, id, text).then(function (response) {
                        learningContent.originalText = text;
                        showNotification(response.modifiedOn);
                    });
                }
            }
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

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
            }
        }

        function createdByCollaborator(question, learningContent) {
            if (question.id != viewModel.questionId) {
                return;
            }

            doAddLearningContent(learningContent);
        }

        function doAddLearningContent(learningContent, text, type) {
            learningContent = learningContent || { id: '', text: text || '', hasFocus: true, type: type || constants.learningContentsTypes.richText };
            viewModel.learningContents.push({
                id: ko.observable(learningContent.id),
                text: ko.observable(learningContent.text),
                originalText: learningContent.text,
                type: learningContent.type,
                hasFocus: ko.observable(learningContent.hasFocus || false)
            });
        }

        function performActionWhenLearningContentIdIsSet(learningContent, action) {
            if (_.isEmptyOrWhitespace(ko.unwrap(learningContent.id))) {
                var subscription = learningContent.id.subscribe(function () {
                    if (!_.isEmptyOrWhitespace(ko.unwrap(learningContent.id))) {
                        action();
                        subscription.dispose();
                    }
                });
            } else {
                action();
            }
        }

        function showNotification() {
            notify.saved();
        }

        function publishActualEvent(event) {
            if (viewModel.questionType === constants.questionType.informationContent.type) {
                eventTracker.publish(event, constants.eventCategories.informationContent);
            } else {
                eventTracker.publish(event);
            }
        }

        function activate(activationData) {
            var questionId = activationData.questionId;
            var questionType = activationData.questionType;

            return learningContentsrepository.getCollection(questionId).then(function (learningContentsList) {
                viewModel.questionId = questionId;
                viewModel.questionType = questionType;
                viewModel.learningContents([]);
                viewModel.isExpanded(true);

                _.each(learningContentsList, doAddLearningContent);
            });
        }

    }
);
