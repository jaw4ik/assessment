define([], function () {

    return {
        handle: function (treeOfContent, context) {

            var dfd = Q.defer();
            
            if (treeOfContent && context && context.courseId) {
                var courses = treeOfContent.courses();

                var courseTreeNode = _.find(courses, function (item) {
                    return item.id == context.courseId;
                });

                if (courseTreeNode) {
                    courseTreeNode.expand().then(function () {
                        if (context.sectionId) {
                            var sectionTreeNode = _.find(courseTreeNode.children(), function (item) {
                                return item.id == context.sectionId;
                            });
                            if (sectionTreeNode) {
                                sectionTreeNode.expand().then(function () {
                                    dfd.resolve();
                                });
                            } else {
                                dfd.resolve();
                            }

                        } else {
                            dfd.resolve();
                        }
                    });
                } else {
                    dfd.resolve();
                }
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        }

    };

})