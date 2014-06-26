define([
    'localization/localizationManager',
    'notify',
    'constants',
    'viewmodels/questions/questionTitle',
    'repositories/learningContentRepository',
    'repositories/questionRepository',
    'viewmodels/questions/learningContents',
    'imageUpload',
    'viewmodels/questions/dragAndDrop/designer',
    'durandal/app',
    'clientContext',
    'viewmodels/questions/dragAndDrop/dropspot'
], function (localizationManager,
             notify,
             constants,
             questionTitle,
             learningContentRepository,
             questionRepository,
             vmLearningContents,
             imageUpload,
             designer,
             app,
             clientContext,
             Dropspot) {

    var viewModel = {
        objectiveId: '',
        questionTitleMaxLength: constants.validation.questionTitleMaxLength,
        title: null,
        dragAndDrop: null,
        initialize: initialize,

        backgroundChangedByCollaborator: backgroundChangedByCollaborator,
        dropspotCreatedByCollaborator: dropspotCreatedByCollaborator,
        dropspotDeletedByCollaborator: dropspotDeletedByCollaborator,
        dropspotTextChangedByCollaborator: dropspotTextChangedByCollaborator,
        dropspotPositionChangedByCollaborator: dropspotPositionChangedByCollaborator,

        isExpanded: ko.observable(true),
        isCreatedQuestion: ko.observable(false),
        toggleExpand: toggleExpand
    };

    app.on(constants.messages.question.dragAndDrop.backgroundChangedByCollaborator, backgroundChangedByCollaborator);
    app.on(constants.messages.question.dragAndDrop.dropspotCreatedByCollaborator, dropspotCreatedByCollaborator);
    app.on(constants.messages.question.dragAndDrop.dropspotDeletedByCollaborator, dropspotDeletedByCollaborator);
    app.on(constants.messages.question.dragAndDrop.dropspotTextChangedByCollaborator, dropspotTextChangedByCollaborator);
    app.on(constants.messages.question.dragAndDrop.dropspotPositionChangedByCollaborator, dropspotPositionChangedByCollaborator);

    return viewModel;

    function initialize(objectiveId, question) {
        viewModel.objectiveId = objectiveId;
        viewModel.questionId = question.id;
        viewModel.title = questionTitle(objectiveId, question);

        var lastCreatedQuestionId = clientContext.get('lastCreatedQuestionId') || '';
        clientContext.remove('lastCreatedQuestionId');
        viewModel.isCreatedQuestion(lastCreatedQuestionId == question.id);

        return learningContentRepository.getCollection(question.id).then(function (learningContents) {
            var sortedLearningContents = _.sortBy(learningContents, function (item) {
                return item.createdOn;
            });

            viewModel.learningContents = vmLearningContents(question.id, sortedLearningContents);
            viewModel.dragAndDrop = designer;

            return designer.activate(question.id);
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

        var dropspot = _.find(designer.dropspots(), function(item) {
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
})