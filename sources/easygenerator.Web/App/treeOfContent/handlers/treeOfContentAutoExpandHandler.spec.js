define(['treeOfContent/handlers/treeOfContentAutoExpandHandler'], function (handler) {

    var
        treeOfContentTraversal = require('treeOfContent/handlers/treeOfContentTraversal')
    ;

    describe('handler [treeOfContentAutoExpandHandler]', function () {

        it('should be object', function () {
            expect(handler).toBeObject();
        });

        describe('handle:', function () {

            it('should be function', function () {
                expect(handler.handle).toBeFunction();
            });

            it('should expand course', function () {
                var courseTreeNode = { id: 'courseId', expand: function () { } };
                var courseTreeNodeExpand = Q.defer();

                spyOn(treeOfContentTraversal, 'getTreeOfContent').andReturn({ children: ko.observableArray([courseTreeNode]) });
                spyOn(courseTreeNode, 'expand').andReturn(courseTreeNodeExpand.promise);

                handler.handle(['courseId']);

                expect(courseTreeNode.expand).toHaveBeenCalled();
            });

            it('should expand course and objective', function () {
                var objectiveTreeNode = { id: 'objectiveId', expand: function () { } };
                var courseTreeNode = { id: 'courseId', children: ko.observableArray([objectiveTreeNode]), expand: function () { } };


                spyOn(treeOfContentTraversal, 'getTreeOfContent').andReturn({ children: ko.observableArray([courseTreeNode]) });

                var courseTreeNodeExpand = Q.defer();
                var objectiveTreeNodeExpand = Q.defer();
                spyOn(courseTreeNode, 'expand').andReturn(courseTreeNodeExpand.promise);
                spyOn(objectiveTreeNode, 'expand').andReturn(objectiveTreeNodeExpand.promise);

                courseTreeNodeExpand.resolve();

                handler.handle(['courseId', 'objectiveId']);

                var promise = courseTreeNodeExpand.promise.fin(function () { });

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(objectiveTreeNode.expand).toHaveBeenCalled();
                });
            });

        });

    });

})