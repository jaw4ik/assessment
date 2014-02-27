define([], function () {

    return {
        handle: function (treeOfContent, context) {

            var dfd = Q.defer();

            if (treeOfContent && context && context[0]) {
                var courseTreeNode = _.find(treeOfContent.children(), function (item) {
                    return item.id == context[0];
                });

                if (courseTreeNode) {
                    courseTreeNode.expand().then(function () {
                        if (context[1]) {
                            var objectiveTreeNode = _.find(courseTreeNode.children(), function (item) {
                                return item.id == context[1];
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