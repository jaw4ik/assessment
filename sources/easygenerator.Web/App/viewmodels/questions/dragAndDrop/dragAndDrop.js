define(['constants', 'viewmodels/questions/questionTitle', 'repositories/learningContentRepository', 'repositories/questionRepository', 'viewmodels/questions/learningContents', 'imageUpload', 'viewmodels/questions/dragAndDrop/designer'], function (constants, questionTitle, learningContentRepository, questionRepository, vmLearningContents, imageUpload, designer) {

    var viewModel = {
        objectiveId: '',
        questionTitleMaxLength: constants.validation.questionTitleMaxLength,
        title: null,
        dragAndDrop: null,
        initialize: initialize
    };

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

})