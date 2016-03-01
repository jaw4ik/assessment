import RelatedSectionTreeNode from './RelatedSectionTreeNode';

import getSectionByIdQuery from 'treeOfContent/queries/getSectionByIdQuery';
import eventTracker from 'eventTracker';
import router from 'plugins/router';

describe('[RelatedSectionTreeNode]', function () {

    it('should be function', function () {
        expect(RelatedSectionTreeNode).toBeFunction();
    });

    it('should create relatedSectionTreeNode', function () {
        var sectionTreeNode = new RelatedSectionTreeNode('id', 'courseId', 'title', 'url');
        expect(sectionTreeNode).toBeObject();
        expect(sectionTreeNode.id).toEqual('id');
        expect(sectionTreeNode.courseId).toEqual('courseId');
        expect(sectionTreeNode.title).toBeObservable();
        expect(sectionTreeNode.title()).toEqual('title');
        expect(sectionTreeNode.url).toEqual('url');
        expect(sectionTreeNode.children).toBeObservableArray();
        expect(sectionTreeNode.isExpanded).toBeObservable();
        expect(sectionTreeNode.expand).toBeFunction();
        expect(sectionTreeNode.collapse).toBeFunction();
        expect(sectionTreeNode.navigateToSection).toBeFunction();
    });

    describe('expand:', function () {

        var sectionTreeNode;
        var execute;

        beforeEach(function () {
            sectionTreeNode = new RelatedSectionTreeNode();

            execute = Q.defer();
            spyOn(getSectionByIdQuery, 'execute').and.returnValue(execute.promise);

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
            expect(sectionTreeNode.expand()).toBePromise();
        });

        describe('when children array is empty', function () {

            beforeEach(function () {
                sectionTreeNode.children([]);
            });

            it('should get children', function (done) {
                execute.resolve({ questions: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                sectionTreeNode.expand().fin(function () {
                    expect(sectionTreeNode.children()[0]).toBeQuestionTreeNode();
                    expect(sectionTreeNode.children()[1]).toBeQuestionTreeNode();
                    done();
                });
            });

            it('should mark node as expanded', function (done) {
                execute.resolve({ questions: [] });
                sectionTreeNode.isExpanded(false);

                sectionTreeNode.expand().fin(function () {
                    expect(sectionTreeNode.isExpanded()).toBeTruthy();
                    done();
                });
            });

        });

        describe('when children array is not empty', function () {

            beforeEach(function () {
                sectionTreeNode.children([{}, {}]);
            });

            it('should not get children', function (done) {
                execute.resolve({ questions: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                sectionTreeNode.expand().fin(function () {
                    expect(getSectionByIdQuery.execute).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should mark node as expanded', function (done) {
                execute.resolve({ questions: [] });
                sectionTreeNode.isExpanded(false);

                sectionTreeNode.expand().fin(function () {
                    expect(sectionTreeNode.isExpanded()).toBeTruthy();
                    done();
                });
            });

        });

    });

    describe('collapse:', function () {

        var sectionTreeNode;

        beforeEach(function () {
            sectionTreeNode = new RelatedSectionTreeNode();
        });

        it('should mark node as collapsed', function () {
            sectionTreeNode.isExpanded(true);

            sectionTreeNode.collapse();

            expect(sectionTreeNode.isExpanded()).toBeFalsy();
        });

    });

    describe('navigateToSection:', function () {
            
        var sectionTreeNode;

        beforeEach(function () {
            sectionTreeNode = new RelatedSectionTreeNode('id', 'courseId');
        });

        it('should be function', function() {
            expect(sectionTreeNode.navigateToSection).toBeFunction();
        });

        it('should send event \'Navigate to objective details\'', function () {
            spyOn(eventTracker, 'publish');
            sectionTreeNode.navigateToSection();
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details', 'Tree of content');
        });

        it('should navigate to section details', function () {
            spyOn(router, 'navigate');
            sectionTreeNode.navigateToSection();
            expect(router.navigate).toHaveBeenCalledWith(sectionTreeNode.url);
        });

    });

});
