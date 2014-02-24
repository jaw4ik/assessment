define(['repositories/courseRepository', 'treeOfContent/TreeNode', 'treeOfContent/RelatedObjectiveTreeNode'], function (courseRepository, TreeNode, RelatedObjectiveTreeNode) {

    return function (id, title, url) {
        TreeNode.call(this, id, title, url);
        this.children = ko.observableArray([]);

        this.isExpanded = ko.observable();
        this.expand = expand;
        this.collapse = collapse;
    };

    function getObjectives(id) {
        return courseRepository.getById(id).then(function (course) {
            return _.map(course.objectives, function (objective) {
                return new RelatedObjectiveTreeNode(objective.id, course.id, objective.title, '#objective/' + objective.id + '?courseId=' + course.id);
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
                return getObjectives(that.id).then(function (objectives) {
                    that.children(objectives);
                    that.isExpanded(true);
                });
            }
        });
    }

    function collapse() {
        this.isExpanded(false);
    }

})