define([], function () {

    return {
        getTreeOfContent: getTreeOfContent,
        getQuestionTreeNodeCollection: getTreeNodeCollectionById,
        getSectionTreeNodeCollection: getTreeNodeCollectionById,
        getCourseTreeNodeCollection: getTreeNodeCollectionById
    };

    function getTreeOfContent() {
        var element = $('[data-view="treeOfContent/treeOfContent"]').get(0);
        if (element) {
            return ko.dataFor(element);
        }
        return undefined;
    }

    function getTreeNodeCollectionById(id) {
        return _.map($('[data-view-id="' + id + '"]').get(), function (element) {
            return ko.dataFor(element);
        });
    }

})