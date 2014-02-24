define(['treeOfContent/QuestionTreeNode'], function (QuestionTreeNode) {

    describe('[QuestionTreeNode]', function () {

        describe('create:', function () {

            it('should be function', function () {
                expect(QuestionTreeNode).toBeFunction();
            });

            it('should create questionTreeNode', function () {
                var questionTreeNode = new QuestionTreeNode('id', 'title', 'url');
                expect(questionTreeNode).toBeObject();
                expect(questionTreeNode.id).toEqual('id');
                expect(questionTreeNode.title).toBeObservable();
                expect(questionTreeNode.title()).toEqual('title');
                expect(questionTreeNode.url).toEqual('url');
            });

        });

    });

})