define(['constants', 'durandal/app', 'localization/localizationManager', 'notify', 'viewmodels/questions/dragAndDropText/designer', 'viewmodels/questions/dragAndDropText/dropspot'],
    function (constants, app, localizationManager, notify, designer, Dropspot) {
        "use strict";

        var viewModel = {
            objectiveId: '',

            dragAndDropText: null,

            backgroundChangedByCollaborator: backgroundChangedByCollaborator,
            dropspotCreatedByCollaborator: dropspotCreatedByCollaborator,
            dropspotDeletedByCollaborator: dropspotDeletedByCollaborator,
            dropspotTextChangedByCollaborator: dropspotTextChangedByCollaborator,
            dropspotPositionChangedByCollaborator: dropspotPositionChangedByCollaborator,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            initialize: initialize
        };

        app.on(constants.messages.question.backgroundChangedByCollaborator, backgroundChangedByCollaborator);
        app.on(constants.messages.question.dragAndDropText.dropspotCreatedByCollaborator, dropspotCreatedByCollaborator);
        app.on(constants.messages.question.dragAndDropText.dropspotDeletedByCollaborator, dropspotDeletedByCollaborator);
        app.on(constants.messages.question.dragAndDropText.dropspotTextChangedByCollaborator, dropspotTextChangedByCollaborator);
        app.on(constants.messages.question.dragAndDropText.dropspotPositionChangedByCollaborator, dropspotPositionChangedByCollaborator);

        return viewModel;

        function initialize(objectiveId, question) {
            viewModel.objectiveId = objectiveId;
            viewModel.questionId = question.id;

            viewModel.dragAndDropText = designer;

            return designer.activate(question.id).then(function () {
                return {
                    viewCaption: localizationManager.localize('DragAndDropTextEditor'),
                    hasQuestionView: true,
                    hasFeedback: true
                };
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function backgroundChangedByCollaborator(question) {
            if (viewModel.questionId != question.id)
                return;

            designer.background(question.background);
        }

        function dropspotCreatedByCollaborator(questionId, id, text) {
            if (viewModel.questionId != questionId)
                return;

            designer.dropspots.push(new Dropspot(id, text, 0, 0));
        }

        function dropspotDeletedByCollaborator(questionId, id) {
            if (viewModel.questionId != questionId)
                return;

            var dropspot = _.find(designer.dropspots(), function (item) {
                return item.id == id;
            });
            if (_.isNullOrUndefined(dropspot))
                return;

            if (dropspot.text.isEditing() || dropspot.position.isMoving()) {
                dropspot.isDeleted = true;
                notify.error(localizationManager.localize('dropspotHasBeenDeletedByCollaborator'));
            } else {
                designer.dropspots.remove(dropspot);
            }
        }

        function dropspotTextChangedByCollaborator(questionId, id, text) {
            if (viewModel.questionId != questionId)
                return;

            var dropspot = _.find(designer.dropspots(), function (item) {
                return item.id == id;
            });
            if (_.isNullOrUndefined(dropspot))
                return;

            dropspot.changeOriginalText(text);
            if (!dropspot.text.isEditing())
                dropspot.text(text);
        }

        function dropspotPositionChangedByCollaborator(questionId, id, x, y) {
            if (viewModel.questionId != questionId)
                return;

            var dropspot = _.find(designer.dropspots(), function (item) {
                return item.id == id;
            });
            if (_.isNullOrUndefined(dropspot))
                return;

            if (!dropspot.position.isMoving()) {
                dropspot.position.x(x);
                dropspot.position.y(y);
            }
        }

    }
);
