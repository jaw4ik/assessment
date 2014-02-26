define(['treeOfContent/handlers/treeOfContentTraversal'], function (treeOfContentTraversal) {

    return {
        handle: function (context) {
            var treeOfContent = treeOfContentTraversal.getTreeOfContent();
            if (context[0] && treeOfContent) {
                _.each(treeOfContent.children(), function (courseTreeNode) {
                    if (courseTreeNode.id == context[0]) {
                        courseTreeNode.expand().then(function () {
                            if (context[1]) {
                                _.each(courseTreeNode.children(), function (objectiveTreeNode) {
                                    if (objectiveTreeNode.id == context[1]) {
                                        objectiveTreeNode.expand();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }

    };

})