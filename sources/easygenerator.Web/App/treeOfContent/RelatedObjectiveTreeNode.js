define(['./TreeNode', './QuestionTreeNode', './queries/getObjectiveByIdQuery', 'commands/createQuestionCommand', 'eventTracker', 'plugins/router'],
    function (TreeNode, QuestionTreeNode, getObjectiveByIdQuery, createQuestionCommand, eventTracker, router) {

        return function (objectiveId, courseId, title, url) {
            TreeNode.call(this, objectiveId, title, url);
            this.courseId = courseId;
            this.children = ko.observableArray();

            this.isExpanded = ko.observable();
            this.expand = expand;
            this.collapse = collapse;

            this.navigateToObjective = navigateToObjective;
        };

        function getQuestions(objectiveId, courseId) {
            return getObjectiveByIdQuery.execute(objectiveId).then(function (objective) {
                return _.map(objective.questions, function (question) {
                    return new QuestionTreeNode(question.id, question.title, '#courses/' + courseId + '/objectives/' + objectiveId + '/questions/' + question.id);
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

        function navigateToObjective() {
            eventTracker.publish('Navigate to objective details', 'Tree of content');
            router.navigate(this.url);
        }

    }
);