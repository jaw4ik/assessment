define(['./TreeNode', './RelatedObjectiveTreeNode', './queries/getCourseByIdQuery', 'eventTracker', 'plugins/router'],
    function (TreeNode, RelatedObjectiveTreeNode, getCourseByIdQuery, eventTracker, router) {

        return function (id, title, url, createdOn) {
            TreeNode.call(this, id, title, url);
            this.children = ko.observableArray([]);

            this.isExpanded = ko.observable();
            this.expand = expand;
            this.collapse = collapse;
            this.createdOn = createdOn;

            this.navigateToCourse = navigateToCourse;
        };

        function getObjectives(id) {
            return getCourseByIdQuery.execute(id).then(function (course) {
                return _.map(course.objectives, function (objective) {
                    return new RelatedObjectiveTreeNode(objective.id, course.id, objective.title, '#objective/' + objective.id + '?courseId=' + course.id);
                });
            });
        }

        function expand() {
            var that = this;
            return getObjectives(that.id).then(function (objectives) {
                that.children(objectives);
                that.isExpanded(true);
            });
        }

        function collapse() {
            this.isExpanded(false);
        }

        function navigateToCourse() {
            eventTracker.publish('Navigate to course details', 'Tree of content');
            router.navigate(this.url);
        }
    }
);