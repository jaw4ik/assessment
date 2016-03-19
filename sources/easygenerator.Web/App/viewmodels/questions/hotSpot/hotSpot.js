define(['constants', 'durandal/app', 'localization/localizationManager', 'notify', './designer', './polygon'],
    function (constants, app, localizationManager, notify, designer, Polygon) {
        "use strict";

        var viewModel = {
            sectionId: '',

            designer: null,

            backgroundChangedByCollaborator: backgroundChangedByCollaborator,
            polygonCreatedByCollaborator: polygonCreatedByCollaborator,
            polygonDeletedByCollaborator: polygonDeletedByCollaborator,
            polygonUpdatedByCollaborator: polygonUpdatedByCollaborator,
            isMultipleUpdatedByCollaborator: isMultipleUpdatedByCollaborator,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            initialize: initialize
        };

        app.on(constants.messages.question.backgroundChangedByCollaborator, backgroundChangedByCollaborator);
        app.on(constants.messages.question.hotSpot.polygonCreatedByCollaborator, polygonCreatedByCollaborator);
        app.on(constants.messages.question.hotSpot.polygonDeletedByCollaborator, polygonDeletedByCollaborator);
        app.on(constants.messages.question.hotSpot.polygonUpdatedByCollaborator, polygonUpdatedByCollaborator);
        app.on(constants.messages.question.hotSpot.isMultipleUpdatedByCollaborator, isMultipleUpdatedByCollaborator);

        return viewModel;

        function initialize(sectionId, question) {
            viewModel.sectionId = sectionId;
            viewModel.questionId = question.id;

            viewModel.designer = designer;

            return designer.activate(question.id).then(function () {
                return {
                    viewCaption: localizationManager.localize('hotSpotTextEditor'),
                    hasQuestionView: true,
                    hasQuestionContent: true,
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

        function polygonCreatedByCollaborator(questionId, polygonId, polygonPoints) {
            if (viewModel.questionId != questionId)
                return;

            designer.polygons.push(new Polygon(polygonId, polygonPoints));
        }

        function polygonDeletedByCollaborator(questionId, id) {
            if (viewModel.questionId != questionId)
                return;

            var polygon = _.find(designer.polygons(), function (item) {
                return item.id == id;
            });

            if (_.isNullOrUndefined(polygon))
                return;

            if (polygon.isEditing()) {
                polygon.isDeleted = true;
                notify.error(localizationManager.localize('hotspotHasBeenDeletedByCollaborator'));
            } else {
                designer.polygons.remove(polygon);
            }
        }

        function polygonUpdatedByCollaborator(questionId, id, points) {
            if (viewModel.questionId != questionId)
                return;

            var polygon = _.find(designer.polygons(), function (item) {
                return item.id == id;
            });
            if (_.isNullOrUndefined(polygon))
                return;

            if (!polygon.isEditing()) {
                polygon.points(points);
            }
        }

        function isMultipleUpdatedByCollaborator(questionId, isMultiple) {
            if (viewModel.questionId != questionId)
                return;

            if (_.isNullOrUndefined(isMultiple))
                return;

            designer.isMultiple(isMultiple);
        }

    }
);
