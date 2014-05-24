define(['treeOfContent/handlers/treeOfContentEventHandler'], function (ctor) {

    var
        treeOfContentTraversal = require('treeOfContent/handlers/treeOfContentTraversal')
    ;

    describe('handler [treeOfContentEventHandler]', function () {

        var handler;
        var children = ko.observableArray([]);

        beforeEach(function () {
            handler = ctor(children);
        });

        describe('questionTitleUpdated:', function () {

            it('should be function', function () {
                expect(handler.questionTitleUpdated).toBeFunction();
            });

            it('should update question title in index', function () {
                var questionTreeNode1 = { id: 'id', title: ko.observable('title') };
                var questionTreeNode2 = { id: 'id', title: ko.observable('title') };
                spyOn(treeOfContentTraversal, 'getQuestionTreeNodeCollection').and.returnValue([questionTreeNode1, questionTreeNode2]);

                handler.questionTitleUpdated({ id: 'id', title: 'updated title' });

                expect(questionTreeNode1.title()).toEqual('updated title');
                expect(questionTreeNode2.title()).toEqual('updated title');
            });

        });

        describe('questionCreated:', function () {

            it('should be function', function () {
                expect(handler.questionCreated).toBeFunction();
            });

            describe('when objective is expanded', function () {

                it('should add question to the objective', function () {
                    var objectiveTreeNode1 = { id: 'objectiveId', children: ko.observableArray([]), isExpanded: ko.observable(true) };
                    var objectiveTreeNode2 = { id: 'objectiveId', children: ko.observableArray([]), isExpanded: ko.observable(true) };
                    spyOn(treeOfContentTraversal, 'getObjectiveTreeNodeCollection').and.returnValue([objectiveTreeNode1, objectiveTreeNode2]);

                    handler.questionCreated('objectiveId', { id: 'questionId', title: 'title' });

                    expect(objectiveTreeNode1.children().length).toEqual(1);
                    expect(objectiveTreeNode1.children().length).toEqual(1);
                });

            });

            describe('when objective is not expanded', function () {

                it('should not add question to the objective', function () {
                    var objectiveTreeNode1 = { id: 'objectiveId', children: ko.observableArray([]), isExpanded: ko.observable(false) };
                    var objectiveTreeNode2 = { id: 'objectiveId', children: ko.observableArray([]), isExpanded: ko.observable(false) };
                    spyOn(treeOfContentTraversal, 'getObjectiveTreeNodeCollection').and.returnValue([objectiveTreeNode1, objectiveTreeNode2]);

                    handler.questionCreated('objectiveId', { id: 'questionId', title: 'title' });

                    expect(objectiveTreeNode1.children().length).toEqual(0);
                    expect(objectiveTreeNode1.children().length).toEqual(0);
                });

            });


        });

        describe('questionsDeleted:', function () {

            it('should be function', function () {
                expect(handler.questionsDeleted).toBeFunction();
            });

            it('should remove question from objective in index', function () {
                var objectiveTreeNode1 = { id: 'objectiveId', children: ko.observableArray([{ id: 'questionId_#1', title: 'title' }, { id: 'questionId_#2', title: 'title' }, { id: 'questionId_#3', title: 'title' }]) };
                var objectiveTreeNode2 = { id: 'objectiveId', children: ko.observableArray([{ id: 'questionId_#1', title: 'title' }, { id: 'questionId_#2', title: 'title' }, { id: 'questionId_#3', title: 'title' }]) };
                spyOn(treeOfContentTraversal, 'getObjectiveTreeNodeCollection').and.returnValue([objectiveTreeNode1, objectiveTreeNode2]);

                handler.questionsDeleted('objectiveId', ['questionId_#1', 'questionId_#3']);

                expect(objectiveTreeNode1.children().length).toEqual(1);
                expect(objectiveTreeNode2.children().length).toEqual(1);

            });

        });

        describe('questionsReordered:', function () {
            it('should be function', function () {
                expect(handler.questionsDeleted).toBeFunction();
            });

            it('should reorder questions in objective in index', function () {
                var objectiveTreeNode1 = { id: 'objectiveId', children: ko.observableArray([{ id: 'questionId_#1', title: 'title' }, { id: 'questionId_#2', title: 'title' }, { id: 'questionId_#3', title: 'title' }]) };
                spyOn(treeOfContentTraversal, 'getObjectiveTreeNodeCollection').and.returnValue([objectiveTreeNode1]);

                handler.questionsReordered({ id: 'objectiveId', questions: [{ id: 'questionId_#3' }, { id: 'questionId_#1' }, { id: 'questionId_#2' }] });

                expect(objectiveTreeNode1.children()[0].id).toEqual('questionId_#3');
                expect(objectiveTreeNode1.children()[1].id).toEqual('questionId_#1');
                expect(objectiveTreeNode1.children()[2].id).toEqual('questionId_#2');
            });
        });


        describe('objectiveTitleUpdated:', function () {

            it('should be function', function () {
                expect(handler.objectiveTitleUpdated).toBeFunction();
            });

            it('should update objective title in index', function () {
                var objectiveTreeNode1 = { id: 'id', title: ko.observable('title') };
                var objectiveTreeNode2 = { id: 'id', title: ko.observable('title') };
                spyOn(treeOfContentTraversal, 'getObjectiveTreeNodeCollection').and.returnValue([objectiveTreeNode1, objectiveTreeNode2]);

                handler.objectiveTitleUpdated({ id: 'id', title: 'updated title' });

                expect(objectiveTreeNode1.title()).toEqual('updated title');
                expect(objectiveTreeNode2.title()).toEqual('updated title');

            });

        });

        describe('objectivesRelated:', function () {

            it('should be function', function () {
                expect(handler.objectiveRelated).toBeFunction();
            });

            describe('when course is expanded', function () {

                describe('when index is undefined', function() {

                    it('should relate objective to the course in the last position', function () {
                        var courseTreeNode1 = { id: 'courseId', children: ko.observableArray([]), isExpanded: ko.observable(true) };

                        spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                        courseTreeNode1.children.push({ id: 'objectiveId_#1', title: 'title' });

                        handler.objectiveRelated('courseId', { id: 'objectiveId_#2', title: 'title' });

                        expect(courseTreeNode1.children().length).toEqual(2);
                        expect(courseTreeNode1.children()[1].id).toEqual('objectiveId_#2');
                    });

                });

                describe('when index is defined', function () {

                    it('should relate objective to the course in the last position', function () {
                        var courseTreeNode1 = { id: 'courseId', children: ko.observableArray([]), isExpanded: ko.observable(true) };

                        spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                        courseTreeNode1.children.push({ id: 'objectiveId_#1', title: 'title' });
                        courseTreeNode1.children.push({ id: 'objectiveId_#2', title: 'title' });

                        handler.objectiveRelated('courseId', { id: 'objectiveId_#3', title: 'title' }, 1);

                        expect(courseTreeNode1.children().length).toEqual(3);
                        expect(courseTreeNode1.children()[1].id).toEqual('objectiveId_#3');
                    });

                });

            });

            describe('when course is not expanded', function () {

                it('should not relate objectives to the course', function () {
                    var courseTreeNode1 = { id: 'courseId', children: ko.observableArray([]), isExpanded: ko.observable(false) };

                    spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                    handler.objectiveRelated('courseId', [{ id: 'objectiveId_#1', title: 'title' }, { id: 'objectiveId_#2', title: 'title' }]);

                    expect(courseTreeNode1.children().length).toEqual(0);
                });

            });
        });

        describe('objectivesUnrelated:', function () {

            it('should be function', function () {
                expect(handler.objectivesUnrelated).toBeFunction();
            });

            it('should unrelate objectives from the course', function () {
                var courseTreeNode1 = { id: 'courseId', children: ko.observableArray([{ id: 'objectiveId_#1', title: 'title' }, { id: 'objectiveId_#2', title: 'title' }, { id: 'objectiveId_#3', title: 'title' }]) };

                spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                handler.objectivesUnrelated('courseId', ['objectiveId_#1', 'objectiveId_#3']);

                expect(courseTreeNode1.children().length).toEqual(1);
                expect(courseTreeNode1.children()[0].id).toEqual('objectiveId_#2');
            });
        });

        describe('objectivesReordered:', function () {

            it('should be function', function () {
                expect(handler.objectivesReordered).toBeFunction();
            });

            it('should reorder objective', function () {
                var courseTreeNode1 = { id: 'courseId', children: ko.observableArray([{ id: 'objectiveId_#1', title: 'title' }, { id: 'objectiveId_#2', title: 'title' }, { id: 'objectiveId_#3', title: 'title' }]) }

                spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                handler.objectivesReordered({ id: 'courseId', objectives: [{ id: 'objectiveId_#3', title: 'title' }, { id: 'objectiveId_#1', title: 'title' }, { id: 'objectiveId_#2', title: 'title' }] });

                expect(courseTreeNode1.children()[0].id).toEqual('objectiveId_#3');
                expect(courseTreeNode1.children()[1].id).toEqual('objectiveId_#1');
                expect(courseTreeNode1.children()[2].id).toEqual('objectiveId_#2');
            });
        });


        describe('courseCreated:', function () {

            it('should be function', function () {
                expect(handler.courseCreated).toBeFunction();
            });

            it('should add course to the tree of content', function () {
                var treeOfContent = { children: ko.observableArray() };
                spyOn(treeOfContentTraversal, 'getTreeOfContent').and.returnValue(treeOfContent);

                handler.courseCreated({ id: 'courseId', title: 'title' });

                expect(treeOfContent.children().length).toEqual(1);
            });

        });

        describe('courseCollaborationStarted:', function () {

            it('should be function', function () {
                expect(handler.courseCollaborationStarted).toBeFunction();
            });

            it('should add course to the tree of content', function () {
                var treeOfContent = { children: ko.observableArray() };
                spyOn(treeOfContentTraversal, 'getTreeOfContent').and.returnValue(treeOfContent);

                handler.courseCollaborationStarted({ id: 'courseId', title: 'title' });

                expect(treeOfContent.children().length).toEqual(1);
            });

        });

        describe('courseDeleted:', function () {

            it('should be function', function () {
                expect(handler.courseDeleted).toBeFunction();
            });

            it('should remove question from objective in index', function () {
                var treeOfContent = { children: ko.observableArray([{ id: 'courseId' }, { id: '-' }]) };
                spyOn(treeOfContentTraversal, 'getTreeOfContent').and.returnValue(treeOfContent);

                handler.courseDeleted('courseId');

                expect(treeOfContent.children().length).toEqual(1);
                expect(treeOfContent.children()[0].id).not.toEqual('courseId');
            });

        });

        describe('courseTitleUpdated:', function () {

            it('should be function', function () {
                expect(handler.courseTitleUpdated).toBeFunction();
            });

            it('should update objective title in index', function () {
                var courseTreeNode1 = { id: 'id', title: ko.observable('title') };
                var courseTreeNode2 = { id: 'id', title: ko.observable('title') };
                spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1, courseTreeNode2]);

                handler.courseTitleUpdated({ id: 'id', title: 'updated title' });

                expect(courseTreeNode1.title()).toEqual('updated title');
                expect(courseTreeNode2.title()).toEqual('updated title');

            });


        });
    });


})

