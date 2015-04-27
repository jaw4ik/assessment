define(['./TreeNode', 'eventTracker', 'plugins/router'], function (TreeNode, eventTracker, router) {

    return function (id, title, url) {
        TreeNode.call(this, id, title, url);

        this.navigateToQuestion = navigateToQuestion;
    };

    function navigateToQuestion() {
        eventTracker.publish('Navigate to question editor', 'Tree of content');
        router.navigate(this.url);
    }

})