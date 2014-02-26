define(['treeOfContent/CourseTreeNode'], function (CourseTreeNode) {

    var
        getCourseByIdQuery = require('treeOfContent/queries/getCourseByIdQuery')
    ;

    describe('[CourseTreeNode]', function () {

        it('should be function', function () {
            expect(CourseTreeNode).toBeFunction();
        });

        it('should create courseTreeNode', function () {
            var courseTreeNode = new CourseTreeNode('id', 'title', 'url');
            expect(courseTreeNode).toBeObject();
            expect(courseTreeNode.id).toEqual('id');
            expect(courseTreeNode.title).toBeObservable();
            expect(courseTreeNode.title()).toEqual('title');
            expect(courseTreeNode.url).toEqual('url');
            expect(courseTreeNode.children).toBeObservableArray();
            expect(courseTreeNode.isExpanded).toBeObservable();
            expect(courseTreeNode.expand).toBeFunction();
            expect(courseTreeNode.collapse).toBeFunction();
        });

        describe('expand:', function () {

            var courseTreeNode;
            var execute;

            beforeEach(function () {
                courseTreeNode = new CourseTreeNode();

                execute = Q.defer();
                spyOn(getCourseByIdQuery, 'execute').andReturn(execute.promise);

                function toBeObjectiveTreeNode(actual) {
                    this.message = function () {
                        return "Expected to be toBeObjectiveTreeNode";
                    };

                    return actual.id && actual.url && ko.isObservable(actual.title);
                }
                this.addMatchers({
                    toBeObjectiveTreeNode: function () {
                        return toBeObjectiveTreeNode.apply(this, [this.actual]);
                    }
                });

            });

            it('should be function', function () {
                expect(courseTreeNode.expand).toBeFunction();
            });

            it('should return promise', function () {
                expect(courseTreeNode.expand()).toBePromise();
            });

            describe('when children array is empty', function () {

                beforeEach(function () {
                    courseTreeNode.children([]);
                });

                it('should get children', function () {
                    execute.resolve({ objectives: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                    var promise = courseTreeNode.expand();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(courseTreeNode.children()[0]).toBeObjectiveTreeNode();
                        expect(courseTreeNode.children()[1]).toBeObjectiveTreeNode();
                    });
                });

                it('should mark node as expanded', function () {
                    execute.resolve({ objectives: [] });
                    courseTreeNode.isExpanded(false);

                    var promise = courseTreeNode.expand();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(courseTreeNode.isExpanded()).toBeTruthy();
                    });

                });
            });

            describe('when children array is not empty', function () {

                beforeEach(function () {
                    courseTreeNode.children([{}, {}]);
                });

                it('should not get children', function () {
                    execute.resolve({ objectives: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                    var promise = courseTreeNode.expand();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(getCourseByIdQuery.execute).not.toHaveBeenCalled();
                    });
                });


                it('should mark node as expanded', function () {
                    execute.resolve({ objectives: [] });
                    courseTreeNode.isExpanded(false);

                    var promise = courseTreeNode.expand();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(courseTreeNode.isExpanded()).toBeTruthy();
                    });

                });

            });

        });

        describe('collapse:', function () {

            var courseTreeNode;

            beforeEach(function () {
                courseTreeNode = new CourseTreeNode();
            });

            it('should be function', function () {
                expect(courseTreeNode.collapse).toBeFunction();
            });

            it('should mark node as collapsed', function () {
                courseTreeNode.isExpanded(true);

                courseTreeNode.collapse();

                expect(courseTreeNode.isExpanded()).toBeFalsy();
            });

        });

    });

})