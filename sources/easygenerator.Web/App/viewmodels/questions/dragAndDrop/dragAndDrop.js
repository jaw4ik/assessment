define(['constants', 'viewmodels/questions/questionTitle', 'repositories/learningContentRepository', 'repositories/questionRepository', 'viewmodels/questions/learningContents', 'imageUpload', 'viewmodels/questions/dragAndDrop/designer', 'durandal/app'], function (constants, questionTitle, learningContentRepository, questionRepository, vmLearningContents, imageUpload, designer, app) {

    var viewModel = {
        objectiveId: '',
        questionTitleMaxLength: constants.validation.questionTitleMaxLength,
        title: null,
        dragAndDrop: null,
        initialize: initialize,
        backgroundChanged: backgroundChanged,
        isExpanded: ko.observable(true),
        toggleExpand: toggleExpand
    };

    app.on(constants.messages.question.dragAndDrop.backgroundChanged, backgroundChanged);

    return viewModel;

    function initialize(objectiveId, question) {
        viewModel.questionId = question.id;
        viewModel.title = questionTitle(objectiveId, question);

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
})