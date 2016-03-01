import ctor from './treeOfContentEventHandler';

import treeOfContentTraversal from './treeOfContentTraversal';

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

        describe('when section is expanded', function () {

            it('should add question to the section', function () {
                var sectionTreeNode1 = { id: 'sectionId', children: ko.observableArray([]), isExpanded: ko.observable(true) };
                var sectionTreeNode2 = { id: 'sectionId', children: ko.observableArray([]), isExpanded: ko.observable(true) };
                spyOn(treeOfContentTraversal, 'getSectionTreeNodeCollection').and.returnValue([sectionTreeNode1, sectionTreeNode2]);

                handler.questionCreated('sectionId', { id: 'questionId', title: 'title' });

                expect(sectionTreeNode1.children().length).toEqual(1);
                expect(sectionTreeNode1.children().length).toEqual(1);
            });

        });

        describe('when section is not expanded', function () {

            it('should not add question to the section', function () {
                var sectionTreeNode1 = { id: 'sectionId', children: ko.observableArray([]), isExpanded: ko.observable(false) };
                var sectionTreeNode2 = { id: 'sectionId', children: ko.observableArray([]), isExpanded: ko.observable(false) };
                spyOn(treeOfContentTraversal, 'getSectionTreeNodeCollection').and.returnValue([sectionTreeNode1, sectionTreeNode2]);

                handler.questionCreated('sectionId', { id: 'questionId', title: 'title' });

                expect(sectionTreeNode1.children().length).toEqual(0);
                expect(sectionTreeNode1.children().length).toEqual(0);
            });

        });


    });

    describe('questionsDeleted:', function () {

        it('should be function', function () {
            expect(handler.questionsDeleted).toBeFunction();
        });

        it('should remove question from section in index', function () {
            var sectionTreeNode1 = { id: 'sectionId', children: ko.observableArray([{ id: 'questionId_#1', title: 'title' }, { id: 'questionId_#2', title: 'title' }, { id: 'questionId_#3', title: 'title' }]) };
            var sectionTreeNode2 = { id: 'sectionId', children: ko.observableArray([{ id: 'questionId_#1', title: 'title' }, { id: 'questionId_#2', title: 'title' }, { id: 'questionId_#3', title: 'title' }]) };
            spyOn(treeOfContentTraversal, 'getSectionTreeNodeCollection').and.returnValue([sectionTreeNode1, sectionTreeNode2]);

            handler.questionsDeleted('sectionId', ['questionId_#1', 'questionId_#3']);

            expect(sectionTreeNode1.children().length).toEqual(1);
            expect(sectionTreeNode2.children().length).toEqual(1);

        });

    });

    describe('questionsReordered:', function () {

        it('should be function', function () {
            expect(handler.questionsDeleted).toBeFunction();
        });

        describe('when section node has chidren', function () {

            it('should reorder questions', function () {
                var sectionTreeNode1 = { id: 'sectionId', isExpanded: ko.observable(true), children: ko.observableArray([{ id: 'questionId_#1', title: 'title' }, { id: 'questionId_#2', title: 'title' }, { id: 'questionId_#3', title: 'title' }]) };
                spyOn(treeOfContentTraversal, 'getSectionTreeNodeCollection').and.returnValue([sectionTreeNode1]);

                handler.questionsReordered({ id: 'sectionId', questions: [{ id: 'questionId_#3' }, { id: 'questionId_#1' }, { id: 'questionId_#2' }] });

                expect(sectionTreeNode1.children()[0].id).toEqual('questionId_#3');
                expect(sectionTreeNode1.children()[1].id).toEqual('questionId_#1');
                expect(sectionTreeNode1.children()[2].id).toEqual('questionId_#2');
            });

        });

        describe('when section does not have children', function () {

            it('should not add children to section', function () {
                var sectionTreeNode1 = { id: 'sectionId', isExpanded: ko.observable(false), children: ko.observableArray([]) };
                spyOn(treeOfContentTraversal, 'getSectionTreeNodeCollection').and.returnValue([sectionTreeNode1]);

                handler.questionsReordered({ id: 'sectionId', questions: [{ id: 'questionId_#3' }, { id: 'questionId_#1' }, { id: 'questionId_#2' }] });

                expect(sectionTreeNode1.children().length).toEqual(0);
            });

        });

    });


    describe('sectionTitleUpdated:', function () {

        it('should be function', function () {
            expect(handler.sectionTitleUpdated).toBeFunction();
        });

        it('should update section title in index', function () {
            var sectionTreeNode1 = { id: 'id', title: ko.observable('title') };
            var sectionTreeNode2 = { id: 'id', title: ko.observable('title') };
            spyOn(treeOfContentTraversal, 'getSectionTreeNodeCollection').and.returnValue([sectionTreeNode1, sectionTreeNode2]);

            handler.sectionTitleUpdated({ id: 'id', title: 'updated title' });

            expect(sectionTreeNode1.title()).toEqual('updated title');
            expect(sectionTreeNode2.title()).toEqual('updated title');

        });

    });

    describe('sectionsRelated:', function () {

        it('should be function', function () {
            expect(handler.sectionRelated).toBeFunction();
        });

        describe('when course is expanded', function () {

            describe('when index is undefined', function () {

                it('should relate section to the course in the last position', function () {
                    var courseTreeNode1 = { id: 'courseId', children: ko.observableArray([]), isExpanded: ko.observable(true) };

                    spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                    courseTreeNode1.children.push({ id: 'sectionId_#1', title: 'title' });

                    handler.sectionRelated('courseId', { id: 'sectionId_#2', title: 'title' });

                    expect(courseTreeNode1.children().length).toEqual(2);
                    expect(courseTreeNode1.children()[1].id).toEqual('sectionId_#2');
                });

            });

            describe('when index is defined', function () {

                it('should relate section to the course in the last position', function () {
                    var courseTreeNode1 = { id: 'courseId', children: ko.observableArray([]), isExpanded: ko.observable(true) };

                    spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                    courseTreeNode1.children.push({ id: 'sectionId_#1', title: 'title' });
                    courseTreeNode1.children.push({ id: 'sectionId_#2', title: 'title' });

                    handler.sectionRelated('courseId', { id: 'sectionId_#3', title: 'title' }, 1);

                    expect(courseTreeNode1.children().length).toEqual(3);
                    expect(courseTreeNode1.children()[1].id).toEqual('sectionId_#3');
                });

            });

        });

        describe('when course is not expanded', function () {

            it('should not relate sections to the course', function () {
                var courseTreeNode1 = { id: 'courseId', children: ko.observableArray([]), isExpanded: ko.observable(false) };

                spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                handler.sectionRelated('courseId', [{ id: 'sectionId_#1', title: 'title' }, { id: 'sectionId_#2', title: 'title' }]);

                expect(courseTreeNode1.children().length).toEqual(0);
            });

        });
    });

    describe('sectionsUnrelated:', function () {

        it('should be function', function () {
            expect(handler.sectionsUnrelated).toBeFunction();
        });

        it('should unrelate sections from the course', function () {
            var courseTreeNode1 = { id: 'courseId', children: ko.observableArray([{ id: 'sectionId_#1', title: 'title' }, { id: 'sectionId_#2', title: 'title' }, { id: 'sectionId_#3', title: 'title' }]) };

            spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

            handler.sectionsUnrelated('courseId', ['sectionId_#1', 'sectionId_#3']);

            expect(courseTreeNode1.children().length).toEqual(1);
            expect(courseTreeNode1.children()[0].id).toEqual('sectionId_#2');
        });
    });

    describe('sectionsReordered:', function () {

        it('should be function', function () {
            expect(handler.sectionsReordered).toBeFunction();
        });

        describe('when course node has children', function () {

            it('should reorder sections', function () {
                var courseTreeNode1 = { id: 'courseId', isExpanded: ko.observable(true), children: ko.observableArray([{ id: 'sectionId_#1', title: 'title' }, { id: 'sectionId_#2', title: 'title' }, { id: 'sectionId_#3', title: 'title' }]) }

                spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                handler.sectionsReordered({ id: 'courseId', sections: [{ id: 'sectionId_#3', title: 'title' }, { id: 'sectionId_#1', title: 'title' }, { id: 'sectionId_#2', title: 'title' }] });

                expect(courseTreeNode1.children()[0].id).toEqual('sectionId_#3');
                expect(courseTreeNode1.children()[1].id).toEqual('sectionId_#1');
                expect(courseTreeNode1.children()[2].id).toEqual('sectionId_#2');
            });

        });

        describe('when course node does not have children', function () {

            it('should not add children to course', function () {
                var courseTreeNode1 = { id: 'courseId', isExpanded: ko.observable(false), children: ko.observableArray([]) }

                spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1]);

                handler.sectionsReordered({ id: 'courseId', sections: [{ id: 'sectionId_#3', title: 'title' }, { id: 'sectionId_#1', title: 'title' }, { id: 'sectionId_#2', title: 'title' }] });

                expect(courseTreeNode1.children().length).toEqual(0);
            });

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

    describe('collaborationStarted:', function () {

        it('should be function', function () {
            expect(handler.collaborationStarted).toBeFunction();
        });

        it('should add course to the tree of content', function () {
            var treeOfContent = { sharedChildren: ko.observableArray() };
            spyOn(treeOfContentTraversal, 'getTreeOfContent').and.returnValue(treeOfContent);

            handler.collaborationStarted({ id: 'courseId', title: 'title' });

            expect(treeOfContent.sharedChildren().length).toEqual(1);
        });

    });

    describe('collaborationFinished:', function () {

        it('should be function', function () {
            expect(handler.collaborationFinished).toBeFunction();
        });

        it('should remove course from section in index', function () {
            var treeOfContent = { sharedChildren: ko.observableArray([{ id: 'courseId' }, { id: '-' }]) };
            spyOn(treeOfContentTraversal, 'getTreeOfContent').and.returnValue(treeOfContent);

            handler.collaborationFinished('courseId');

            expect(treeOfContent.sharedChildren().length).toEqual(1);
            expect(treeOfContent.sharedChildren()[0].id).not.toEqual('courseId');
        });

    });

    describe('courseDeleted:', function () {

        it('should be function', function () {
            expect(handler.courseDeleted).toBeFunction();
        });

        it('should remove question from section in index', function () {
            var treeOfContent = { children: ko.observableArray([{ id: 'courseId' }, { id: '-' }]) };
            spyOn(treeOfContentTraversal, 'getTreeOfContent').and.returnValue(treeOfContent);

            handler.courseDeleted('courseId');

            expect(treeOfContent.children().length).toEqual(1);
            expect(treeOfContent.children()[0].id).not.toEqual('courseId');
        });

    });

    describe('courseDeletedByCollaborator:', function () {

        it('should be function', function () {
            expect(handler.courseDeletedByCollaborator).toBeFunction();
        });

        it('should remove question from section in index', function () {
            var treeOfContent = { sharedChildren: ko.observableArray([{ id: 'courseId' }, { id: '-' }]) };
            spyOn(treeOfContentTraversal, 'getTreeOfContent').and.returnValue(treeOfContent);

            handler.courseDeletedByCollaborator('courseId');

            expect(treeOfContent.sharedChildren().length).toEqual(1);
            expect(treeOfContent.sharedChildren()[0].id).not.toEqual('courseId');
        });

    });

    describe('courseTitleUpdated:', function () {

        it('should be function', function () {
            expect(handler.courseTitleUpdated).toBeFunction();
        });

        it('should update section title in index', function () {
            var courseTreeNode1 = { id: 'id', title: ko.observable('title') };
            var courseTreeNode2 = { id: 'id', title: ko.observable('title') };
            spyOn(treeOfContentTraversal, 'getCourseTreeNodeCollection').and.returnValue([courseTreeNode1, courseTreeNode2]);

            handler.courseTitleUpdated({ id: 'id', title: 'updated title' });

            expect(courseTreeNode1.title()).toEqual('updated title');
            expect(courseTreeNode2.title()).toEqual('updated title');

        });


    });
});

