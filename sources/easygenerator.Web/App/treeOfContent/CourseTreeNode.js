define(['./TreeNode', './RelatedSectionTreeNode', './queries/getCourseByIdQuery', 'eventTracker', 'routing/router'],
    function (TreeNode, RelatedSectionTreeNode, getCourseByIdQuery, eventTracker, router) {

        return function (id, title, url, createdOn) {
            TreeNode.call(this, id, title, url);
            this.children = ko.observableArray([]);

            this.isExpanded = ko.observable();
            this.expand = expand;
            this.collapse = collapse;
            this.createdOn = createdOn;

            this.navigateToCourse = navigateToCourse;
        };

        function getSections(id) {
            return getCourseByIdQuery.execute(id).then(function (course) {
                return _.map(course.sections, function (section) {
                    return new RelatedSectionTreeNode(section.id, course.id, section.title, '#courses/' + course.id + '/sections/' + section.id);
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
                    return getSections(that.id).then(function (sections) {
                        that.children(sections);
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
    }
);