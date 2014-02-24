define([], function () {

    return {
        getTreeOfContent: getTreeOfContent,
        getQuestionTreeNodeCollection: getTreeNodeById,
        getObjectiveTreeNodeCollection: getTreeNodeById,
        getCourseTreeNodeCollection: getTreeNodeById
    };

    function getTreeOfContent() {
        return ko.dataFor($('[data-view="treeOfContent/treeOfContent"]').get(0));
    }

    function getTreeNodeById(id) {
        return _.map($('[data-view-id="' + id + '"]').get(), function (element) {
            return ko.dataFor(element);
        });
    }

})