define(['./TreeNode', './QuestionTreeNode', './queries/getSectionByIdQuery', 'eventTracker', 'routing/router'],
    function (TreeNode, QuestionTreeNode, getSectionByIdQuery, eventTracker, router) {

        return function (sectionId, courseId, title, url) {
            TreeNode.call(this, sectionId, title, url);
            this.courseId = courseId;
            this.children = ko.observableArray();

            this.isExpanded = ko.observable();
            this.expand = expand;
            this.collapse = collapse;

            this.navigateToSection = navigateToSection;
        };

        function getQuestions(sectionId, courseId) {
            return getSectionByIdQuery.execute(sectionId).then(function (section) {
                return _.map(section.questions, function (question) {
                    return new QuestionTreeNode(question.id, question.title, '#courses/' + courseId + '/sections/' + sectionId + '/questions/' + question.id);
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

        function navigateToSection() {
            eventTracker.publish('Navigate to objective details', 'Tree of content');
            router.navigate(this.url);
        }

    }
);