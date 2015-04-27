define(['./RelatedObjectiveTreeNode'], function (RelatedObjectiveTreeNode) {

    var
        getObjectiveByIdQuery = require('treeOfContent/queries/getObjectiveByIdQuery'),
        eventTracker = require('eventTracker'),
        router = require('plugins/router')
    ;

    describe('[RelatedObjectiveTreeNode]', function () {

        it('should be function', function () {
            expect(RelatedObjectiveTreeNode).toBeFunction();
        });

        it('should create relatedObjectiveTreeNode', function () {
            var objectiveTreeNode = new RelatedObjectiveTreeNode('id', 'courseId', 'title', 'url');
            expect(objectiveTreeNode).toBeObject();
            expect(objectiveTreeNode.id).toEqual('id');
            expect(objectiveTreeNode.courseId).toEqual('courseId');
            expect(objectiveTreeNode.title).toBeObservable();
            expect(objectiveTreeNode.title()).toEqual('title');
            expect(objectiveTreeNode.url).toEqual('url');
            expect(objectiveTreeNode.children).toBeObservableArray();
            expect(objectiveTreeNode.isExpanded).toBeObservable();
            expect(objectiveTreeNode.expand).toBeFunction();
            expect(objectiveTreeNode.collapse).toBeFunction();
            expect(objectiveTreeNode.navigateToObjective).toBeFunction();
        });

        describe('expand:', function () {

            var objectiveTreeNode;
            var execute;

            beforeEach(function () {
                objectiveTreeNode = new RelatedObjectiveTreeNode();

                execute = Q.defer();
                spyOn(getObjectiveByIdQuery, 'execute').and.returnValue(execute.promise);

                jasmine.addMatchers({
                    toBeQuestionTreeNode: function () {
                        return {
                            compare: function (actual) {
                                var result = {
                                    pass: actual.id && actual.url && ko.isObservable(actual.title)
                                }

                                if (result.pass) {
                                    result.message = "Ok";
                                } else {
                                    result.message = "Expected to be QuestionTreeNode";
                                }

                                return result;
                            }
                        }
                    }
                });

            });

            it('should return promise', function () {
                expect(objectiveTreeNode.expand()).toBePromise();
            });

            describe('when children array is empty', function () {

                beforeEach(function () {
                    objectiveTreeNode.children([]);
                });

                it('should get children', function (done) {
                    execute.resolve({ questions: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                    objectiveTreeNode.expand().fin(function () {
                        expect(objectiveTreeNode.children()[0]).toBeQuestionTreeNode();
                        expect(objectiveTreeNode.children()[1]).toBeQuestionTreeNode();
                        done();
                    });
                });

                it('should mark node as expanded', function (done) {
                    execute.resolve({ questions: [] });
                    objectiveTreeNode.isExpanded(false);

                    objectiveTreeNode.expand().fin(function () {
                        expect(objectiveTreeNode.isExpanded()).toBeTruthy();
                        done();
                    });
                });

            });

            describe('when children array is not empty', function () {

                beforeEach(function () {
                    objectiveTreeNode.children([{}, {}]);
                });

                it('should not get children', function (done) {
                    execute.resolve({ questions: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                    objectiveTreeNode.expand().fin(function () {
                        expect(getObjectiveByIdQuery.execute).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should mark node as expanded', function (done) {
                    execute.resolve({ questions: [] });
                    objectiveTreeNode.isExpanded(false);

                    objectiveTreeNode.expand().fin(function () {
                        expect(objectiveTreeNode.isExpanded()).toBeTruthy();
                        done();
                    });
                });

            });

        });

        describe('collapse:', function () {

            var objectiveTreeNode;

            beforeEach(function () {
                objectiveTreeNode = new RelatedObjectiveTreeNode();
            });

            it('should mark node as collapsed', function () {
                objectiveTreeNode.isExpanded(true);

                objectiveTreeNode.collapse();

                expect(objectiveTreeNode.isExpanded()).toBeFalsy();
            });

        });

        describe('navigateToObjective:', function () {
            
            var objectiveTreeNode;

            beforeEach(function () {
                objectiveTreeNode = new RelatedObjectiveTreeNode('id', 'courseId');
            });

            it('should be function', function() {
                expect(objectiveTreeNode.navigateToObjective).toBeFunction();
            });

            it('should send event \'Navigate to objective details\'', function () {
                spyOn(eventTracker, 'publish');
                objectiveTreeNode.navigateToObjective();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details', 'Tree of content');
            });

            it('should navigate to objective details', function () {
                spyOn(router, 'navigate');
                objectiveTreeNode.navigateToObjective();
                expect(router.navigate).toHaveBeenCalledWith(objectiveTreeNode.url);
            });

        });

    });

})