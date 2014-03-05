define([], function () {

    return {
        handle: function (treeOfContent, context) {

            var dfd = Q.defer();

            if (treeOfContent && context && context.courseId) {
                var courseTreeNode = _.find(treeOfContent.children(), function (item) {
                    return item.id == context.courseId;
                });

                if (courseTreeNode) {
                    courseTreeNode.expand().then(function () {
                        if (context.objectiveId) {
                            var objectiveTreeNode = _.find(courseTreeNode.children(), function (item) {
                                return item.id == context.objectiveId;
                            });
                            if (objectiveTreeNode) {
                                objectiveTreeNode.expand().then(function () {
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