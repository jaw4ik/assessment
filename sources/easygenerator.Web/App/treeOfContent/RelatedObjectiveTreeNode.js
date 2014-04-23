define(['treeOfContent/TreeNode', 'treeOfContent/QuestionTreeNode', 'treeOfContent/queries/getObjectiveByIdQuery', 'commands/createQuestionCommand', 'eventTracker', 'plugins/router'],
    function (TreeNode, QuestionTreeNode, getObjectiveByIdQuery, createQuestionCommand, eventTracker, router) {

        return function (objectiveId, courseId, title, url) {
            TreeNode.call(this, objectiveId, title, url);
            this.courseId = courseId;
            this.children = ko.observableArray();

            this.isExpanded = ko.observable();
            this.expand = expand;
            this.collapse = collapse;
            this.createQuestion = createQuestion;

            this.navigateToObjective = navigateToObjective;
        };

        function getQuestions(objectiveId, courseId) {
            return getObjectiveByIdQuery.execute(objectiveId).then(function (objective) {
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
            createQuestionCommand.execute(this.id, this.courseId, 'Tree of content');
        }

        function navigateToObjective() {
            eventTracker.publish('Navigate to objective details', 'Tree of content');
            router.navigate(this.url);
        }

    }
);