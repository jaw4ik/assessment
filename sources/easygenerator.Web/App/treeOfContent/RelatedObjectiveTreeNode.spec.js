define(['treeOfContent/RelatedObjectiveTreeNode'], function (RelatedObjectiveTreeNode) {

    var
        objectiveRepository = require('repositories/objectiveRepository'),
        createQuestionCommand = require('treeOfContent/commands/createQuestionCommand')
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
            expect(objectiveTreeNode.createQuestion).toBeFunction();
        });

        describe('expand:', function () {

            var objectiveTreeNode;
            var getById;

            beforeEach(function () {
                objectiveTreeNode = new RelatedObjectiveTreeNode();

                getById = Q.defer();
                spyOn(objectiveRepository, 'getById').andReturn(getById.promise);

                function toBeQuestionTreeNode(actual) {
                    this.message = function () {
                        return "Expected to be QuestionTreeNode";
                    };

                    return actual.id && actual.url && ko.isObservable(actual.title);
                }

                this.addMatchers({
                    toBeQuestionTreeNode: function () {
                        return toBeQuestionTreeNode.apply(this, [this.actual]);
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

                it('should get children', function () {
                    getById.resolve({ questions: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                    var promise = objectiveTreeNode.expand();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(objectiveTreeNode.children()[0]).toBeQuestionTreeNode();
                        expect(objectiveTreeNode.children()[1]).toBeQuestionTreeNode();
                    });
                });

                it('should mark node as expanded', function () {
                    getById.resolve({ questions: [] });
                    objectiveTreeNode.isExpanded(false);

                    var promise = objectiveTreeNode.expand();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(objectiveTreeNode.isExpanded()).toBeTruthy();
                    });

                });

            });

            describe('when children array is not empty', function () {

                beforeEach(function () {
                    objectiveTreeNode.children([{}, {}]);
                });

                it('should not get children', function () {
                    getById.resolve({ questions: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                    var promise = objectiveTreeNode.expand();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(objectiveRepository.getById).not.toHaveBeenCalled();
                    });
                });

                it('should mark node as expanded', function () {
                    getById.resolve({ questions: [] });
                    objectiveTreeNode.isExpanded(false);

                    var promise = objectiveTreeNode.expand();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(objectiveTreeNode.isExpanded()).toBeTruthy();
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

        describe('createQuestion:', function () {

            var objectiveTreeNode;

            beforeEach(function () {
                objectiveTreeNode = new RelatedObjectiveTreeNode('id', 'courseId');
                spyOn(createQuestionCommand, 'execute');
            });

            it('should execute createQuestionCommand', function () {
                objectiveTreeNode.createQuestion();
                expect(createQuestionCommand.execute).toHaveBeenCalledWith('id', 'courseId');
            });

        });

    });

})