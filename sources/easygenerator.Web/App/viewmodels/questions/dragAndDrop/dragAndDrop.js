define([
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
], function (constants, questionTitle, learningContentRepository, questionRepository, vmLearningContents, imageUpload, designer, app, clientContext, Dropspot) {

    var viewModel = {
        objectiveId: '',
        questionTitleMaxLength: constants.validation.questionTitleMaxLength,
        title: null,
        dragAndDrop: null,
        initialize: initialize,

        backgroundChanged: backgroundChanged,
        dropspotCreated: dropspotCreated,
        dropspotDeleted: dropspotDeleted,
        dropspotTextChanged: dropspotTextChanged,
        dropspotPositionChanged: dropspotPositionChanged,

        isExpanded: ko.observable(true),
        isCreatedQuestion: ko.observable(false),
        toggleExpand: toggleExpand
    };

    app.on(constants.messages.question.dragAndDrop.backgroundChanged, backgroundChanged);
    app.on(constants.messages.question.dragAndDrop.dropspotCreated, dropspotCreated);
    app.on(constants.messages.question.dragAndDrop.dropspotDeleted, dropspotDeleted);
    app.on(constants.messages.question.dragAndDrop.dropspotTextChanged, dropspotTextChanged);
    app.on(constants.messages.question.dragAndDrop.dropspotPositionChanged, dropspotPositionChanged);

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

    function backgroundChanged(question) {
        if (viewModel.questionId != question.id)
            return;

        designer.background(question.background);
    }

    function dropspotCreated(questionId, id, text) {
        if (viewModel.questionId != questionId)
            return;

        designer.dropspots.push(new Dropspot(id, text, 0, 0));
    }

    function dropspotDeleted(questionId, id) {
        if (viewModel.questionId != questionId)
            return;

        
    }

    function dropspotTextChanged(questionId, id, text) {
        if (viewModel.questionId != questionId)
            return;

        
    }

    function dropspotPositionChanged(questionId, id, x, y) {
        if (viewModel.questionId != questionId)
            return;

        
    }
})