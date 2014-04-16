﻿define(['treeOfContent/TreeNode', 'treeOfContent/RelatedObjectiveTreeNode', 'treeOfContent/queries/getCourseByIdQuery', 'eventTracker', 'plugins/router'],
    function (TreeNode, RelatedObjectiveTreeNode, getCourseByIdQuery, eventTracker, router) {

        return function(id, title, url) {
            TreeNode.call(this, id, title, url);
            this.children = ko.observableArray([]);

            this.isExpanded = ko.observable();
            this.expand = expand;
            this.collapse = collapse;

            this.navigateToCourse = navigateToCourse;
            this.navigateToCreateObjective = navigateToCreateObjective;
        };

        function getObjectives(id) {
            return getCourseByIdQuery.execute(id).then(function(course) {
                return _.map(course.objectives, function(objective) {
                    return new RelatedObjectiveTreeNode(objective.id, course.id, objective.title, '#objective/' + objective.id + '?courseId=' + course.id);
                });
            });
        }

        function expand() {
            var that = this;
            return Q.fcall(function() {
                if (that.children().length) {
                    that.isExpanded(true);
                    return undefined;
                } else {
                    return getObjectives(that.id).then(function(objectives) {
                        that.children(objectives);
                        that.isExpanded(true);
                    });
                }
            });
        }

        function collapse() {
            this.isExpanded(false);
        }

        function navigateToCourse() {
            eventTracker.publish('Navigate to course details', 'Tree of content');
            router.navigate(this.url);
        }

        function navigateToCreateObjective() {
            eventTracker.publish('Navigate to create objective', 'Tree of content');
            router.navigate('objective/create?courseId=' + this.id);
        }

    }
);