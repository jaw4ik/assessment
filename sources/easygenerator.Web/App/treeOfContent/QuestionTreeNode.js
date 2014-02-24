define(['treeOfContent/TreeNode'], function (TreeNode) {
    return function (id, title, url) {
        TreeNode.call(this, id, title, url);
    };
})