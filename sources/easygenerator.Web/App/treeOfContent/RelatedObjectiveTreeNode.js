define(['repositories/objectiveRepository', 'treeOfContent/TreeNode', 'treeOfContent/questionTreeNode', 'treeOfContent/commands/createQuestionCommand'], function (objectiveRepository, TreeNode, QuestionTreeNode, createQuestionCommand) {

    return function (objectiveId, courseId, title, url) {
        TreeNode.call(this, objectiveId, title, url);
        this.courseId = courseId;
        this.children = ko.observableArray();

        this.isExpanded = ko.observable();
        this.expand = expand;
        this.collapse = collapse;
        this.createQuestion = createQuestion;
    };

    function getQuestions(objectiveId, courseId) {
        return objectiveRepository.getById(objectiveId).then(function (objective) {
            return _.map(objective.questions, function (question) {
                return new QuestionTreeNode(question.id, question.title, '#objective/' + objectiveId + '/question/' + question.id + "?courseId=" + courseId);
            });
        });
    }

    function expand() {
        var that = this;
        return Q.fcall(function () {
            if (that.children().length) {
                that.isExpanded(true);
                return undefined;
            } else {
                return getQuestions(that.id, that.courseId).then(function (questions) {
                    that.children(questions);
                    that.isExpanded(true);
                });
            }
        });
    }

    function collapse() {
        this.isExpanded(false);
    }

    function createQuestion() {
        createQuestionCommand.execute(this.id, this.courseId);
    }
})