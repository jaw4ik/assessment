define(['./treeOfContentAutoExpandHandler'], function (handler) {

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

                    it('should resolve promise', function (done) {
                        var promise = handler.handle({ children: ko.observableArray([]) }, ['courseId']);

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            done();
                        });
                    });

                });

                describe('and course was found', function () {

                    var courseTreeNode = { id: 'courseId', expand: function () { } };
                    var treeOfContent = { children: ko.observableArray([courseTreeNode]), sharedChildren: ko.observableArray([]) };

                    beforeEach(function () {
                        var courseTreeNodeExpand = Q.defer();
                        spyOn(courseTreeNode, 'expand').and.returnValue(courseTreeNodeExpand.promise);

                        courseTreeNodeExpand.resolve();
                    });

                    it('should expand course', function (done) {
                        handler.handle(treeOfContent, { courseId: 'courseId' }).fin(function () {
                            expect(courseTreeNode.expand).toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('and course was expanded', function () {

                        it('should resolve promise', function (done) {
                            var promise = handler.handle(treeOfContent, { courseId: 'courseId' });

                            promise.fin(function () {
                                expect(promise).toBeResolved();
                                done();
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

                    treeOfContent = { children: ko.observableArray([courseTreeNode]), sharedChildren: ko.observableArray([]) };

                    spyOn(courseTreeNode, 'expand').and.returnValue(courseTreeNodeExpand.promise);
                    spyOn(objectiveTreeNode, 'expand').and.returnValue(objectiveTreeNodeExpand.promise);

                    courseTreeNodeExpand.resolve();
                    objectiveTreeNodeExpand.resolve();
                });

                describe('and objective was not found', function () {

                    it('should resolve promise', function (done) {
                        var promise = handler.handle(treeOfContent, { courseId: 'courseId', objectiveId: '-' });

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            done();
                        });
                    });

                });

                it('should expand objective', function (done) {
                    handler.handle(treeOfContent, { courseId: 'courseId', objectiveId: 'objectiveId' }).fin(function () {
                        expect(objectiveTreeNode.expand).toHaveBeenCalled();
                        done();
                    });
                });

                describe('and objective was expanded', function () {

                    it('should resolve promise', function (done) {
                        var promise = handler.handle(treeOfContent, { courseId: 'courseId', objectiveId: 'objectiveId' });

                        promise.fin(function () {
                            expect(objectiveTreeNode.expand).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });


            describe('when context is not specified', function () {

                it('should resolve promise', function (done) {
                    var promise = handler.handle({ children: ko.observableArray([]) });

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });
            });

            describe('when context is empty', function () {

                it('should resolve promise', function (done) {
                    var promise = handler.handle({ children: ko.observableArray([]) }, {});

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

            });

            describe('when tree of content is not specified', function () {

                it('should resolve promise', function (done) {
                    var promise = handler.handle(undefined, { courseId: '-' });

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

            });

        });

    });

})