define(['treeOfContent/handlers/treeOfContentAutoExpandHandler'], function (handler) {

    describe('handler [treeOfContentAutoExpandHandler]', function () {

        it('should be object', function () {
            expect(handler).toBeObject();
        });

        describe('handle:', function () {

            it('should be function', function () {
                expect(handler.handle).toBeFunction();
            });

            it('should return promise', function () {
                expect(handler.handle({})).toBePromise();
            });

            describe('when context has course', function () {

                describe('and course was not found', function () {

                    it('should resolve promise', function () {
                        var promise = handler.handle({ children: ko.observableArray([]) }, ['courseId']);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

                describe('and course was found', function () {

                    var courseTreeNode = { id: 'courseId', expand: function () { } };
                    var treeOfContent = { children: ko.observableArray([courseTreeNode]) };

                    beforeEach(function () {
                        var courseTreeNodeExpand = Q.defer();
                        spyOn(courseTreeNode, 'expand').andReturn(courseTreeNodeExpand.promise);

                        courseTreeNodeExpand.resolve();
                    });

                    it('should expand course', function () {
                        var promise = handler.handle(treeOfContent, { courseId: 'courseId' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(courseTreeNode.expand).toHaveBeenCalled();
                        });

                    });

                    describe('and course was expanded', function () {

                        it('should resolve promise', function () {
                            var promise = handler.handle(treeOfContent, { courseId: 'courseId' });

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                            });
                        });

                    });

                });

            });

            describe('when context has objective', function () {

                var treeOfContent;

                var objectiveTreeNode;
                var objectiveTreeNodeExpand = Q.defer();

                beforeEach(function () {
                    objectiveTreeNode = { id: 'objectiveId', expand: function () { } };
                    objectiveTreeNodeExpand = Q.defer();

                    var courseTreeNode = { id: 'courseId', children: ko.observableArray([objectiveTreeNode]), expand: function () { } };
                    var courseTreeNodeExpand = Q.defer();

                    treeOfContent = { children: ko.observableArray([courseTreeNode]) };

                    spyOn(courseTreeNode, 'expand').andReturn(courseTreeNodeExpand.promise);
                    spyOn(objectiveTreeNode, 'expand').andReturn(objectiveTreeNodeExpand.promise);

                    courseTreeNodeExpand.resolve();
                    objectiveTreeNodeExpand.resolve();
                });

                describe('and objective was not found', function () {

                    it('should resolve promise', function () {
                        var promise = handler.handle(treeOfContent, { courseId: 'courseId', objectiveId: '-' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

                it('should expand objective', function () {
                    var promise = handler.handle(treeOfContent, { courseId: 'courseId', objectiveId: 'objectiveId' });

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(objectiveTreeNode.expand).toHaveBeenCalled();
                    });
                });

                describe('and objective was expanded', function () {

                    it('should resolve promise', function () {
                        var promise = handler.handle(treeOfContent, { courseId: 'courseId', objectiveId: 'objectiveId' });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(objectiveTreeNode.expand).toHaveBeenCalled();
                        });
                    });

                });

            });


            describe('when context is not specified', function () {

                it('should resolve promise', function () {
                    var promise = handler.handle({ children: ko.observableArray([]) });

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                    });
                });
            });

            describe('when context is empty', function () {

                it('should resolve promise', function () {
                    var promise = handler.handle({ children: ko.observableArray([]) }, {});

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                    });
                });

            });

            describe('when tree of content is not specified', function () {

                it('should resolve promise', function () {
                    var promise = handler.handle(undefined, { courseId: '-' });

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                    });
                });

            });

        });

    });

})