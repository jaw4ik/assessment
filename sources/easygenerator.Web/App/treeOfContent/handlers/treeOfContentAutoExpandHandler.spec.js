import handler from './treeOfContentAutoExpandHandler';

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
                    var promise = handler.handle({ courses: ko.observableArray([]) }, ['courseId']);

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

            });

            describe('and course was found', function () {

                var courseTreeNode = { id: 'courseId', expand: function () { } };
                var treeOfContent = { courses: ko.observableArray([courseTreeNode]), sharedChildren: ko.observableArray([]) };

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

        describe('when context has section', function () {

            var treeOfContent;

            var sectionTreeNode;
            var sectionTreeNodeExpand = Q.defer();

            beforeEach(function () {
                sectionTreeNode = { id: 'sectionId', expand: function () { } };
                sectionTreeNodeExpand = Q.defer();

                var courseTreeNode = { id: 'courseId', children: ko.observableArray([sectionTreeNode]), expand: function () { } };
                var courseTreeNodeExpand = Q.defer();

                treeOfContent = {
                    courses: ko.observableArray([courseTreeNode])
                };

                spyOn(courseTreeNode, 'expand').and.returnValue(courseTreeNodeExpand.promise);
                spyOn(sectionTreeNode, 'expand').and.returnValue(sectionTreeNodeExpand.promise);

                courseTreeNodeExpand.resolve();
                sectionTreeNodeExpand.resolve();
            });

            describe('and section was not found', function () {

                it('should resolve promise', function (done) {
                    var promise = handler.handle(treeOfContent, { courseId: 'courseId', sectionId: '-' });

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

            });

            it('should expand section', function (done) {
                handler.handle(treeOfContent, { courseId: 'courseId', sectionId: 'sectionId' }).fin(function () {
                    expect(sectionTreeNode.expand).toHaveBeenCalled();
                    done();
                });
            });

            describe('and section was expanded', function () {

                it('should resolve promise', function (done) {
                    var promise = handler.handle(treeOfContent, { courseId: 'courseId', sectionId: 'sectionId' });

                    promise.fin(function () {
                        expect(sectionTreeNode.expand).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });


        describe('when context is not specified', function () {

            it('should resolve promise', function (done) {
                var promise = handler.handle({ courses: ko.observableArray([]) });

                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                });
            });
        });

        describe('when context is empty', function () {

            it('should resolve promise', function (done) {
                var promise = handler.handle({ courses: ko.observableArray([]) }, {});

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
