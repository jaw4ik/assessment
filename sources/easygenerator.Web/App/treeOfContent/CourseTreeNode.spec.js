import CourseTreeNode from './CourseTreeNode';

import getCourseByIdQuery from './queries/getCourseByIdQuery';
import eventTracker from 'eventTracker';
import router from 'routing/router';

describe('[CourseTreeNode]', function () {

    it('should be function', function () {
        expect(CourseTreeNode).toBeFunction();
    });

    it('should create courseTreeNode', function () {
        var courseTreeNode = new CourseTreeNode('id', 'title', 'url', 'date');
        expect(courseTreeNode).toBeObject();
        expect(courseTreeNode.id).toEqual('id');
        expect(courseTreeNode.title).toBeObservable();
        expect(courseTreeNode.title()).toEqual('title');
        expect(courseTreeNode.url).toEqual('url');
        expect(courseTreeNode.children).toBeObservableArray();
        expect(courseTreeNode.isExpanded).toBeObservable();
        expect(courseTreeNode.expand).toBeFunction();
        expect(courseTreeNode.collapse).toBeFunction();
        expect(courseTreeNode.navigateToCourse).toBeFunction();
        expect(courseTreeNode.createdOn).toBe('date');
    });

    describe('expand:', function () {

        var courseTreeNode;
        var execute;

        beforeEach(function () {
            courseTreeNode = new CourseTreeNode();

            execute = Q.defer();
            spyOn(getCourseByIdQuery, 'execute').and.returnValue(execute.promise);

            jasmine.addMatchers({
                toBeSectionTreeNode: function () {
                    return {
                        compare: function (actual) {
                            var result = {
                                pass: actual.id && actual.url && ko.isObservable(actual.title)
                            }

                            if (result.pass) {
                                result.message = "Ok";
                            } else {
                                result.message = "Expected to be SectionTreeNode";
                            }

                            return result;
                        }
                    }
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

            it('should get children', function (done) {
                execute.resolve({ sections: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                courseTreeNode.expand().fin(function () {
                    expect(courseTreeNode.children()[0]).toBeSectionTreeNode();
                    expect(courseTreeNode.children()[1]).toBeSectionTreeNode();
                    done();
                });
            });

            it('should mark node as expanded', function (done) {
                execute.resolve({ sections: [] });
                courseTreeNode.isExpanded(false);

                courseTreeNode.expand().fin(function () {
                    expect(courseTreeNode.isExpanded()).toBeTruthy();
                    done();
                });
            });
        });

        describe('when children array is not empty', function () {

            beforeEach(function () {
                courseTreeNode.children([{}, {}]);
            });

            it('should not get children', function (done) {
                execute.resolve({ sections: [{ id: 1, title: '1' }, { id: 2, title: '2' }] });

                courseTreeNode.expand().fin(function () {
                    expect(getCourseByIdQuery.execute).not.toHaveBeenCalled();
                    done();
                });
            });


            it('should mark node as expanded', function (done) {
                execute.resolve({ sections: [] });
                courseTreeNode.isExpanded(false);

                courseTreeNode.expand().fin(function () {
                    expect(courseTreeNode.isExpanded()).toBeTruthy();
                    done();
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

    describe('navigateToCourse:', function () {
            
        var courseTreeNode;

        beforeEach(function () {
            courseTreeNode = new CourseTreeNode('id', 'title', 'url');
        });

        it('should be function', function() {
            expect(courseTreeNode.navigateToCourse).toBeFunction();
        });

        it('should send event \'Navigate to course details\'', function () {
            spyOn(eventTracker, 'publish');
            courseTreeNode.navigateToCourse();
            expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to course details', 'Tree of content');
        });

        it('should navigate to course details', function () {
            spyOn(router, 'navigate');
            courseTreeNode.navigateToCourse();
            expect(router.navigate).toHaveBeenCalledWith(courseTreeNode.url);
        });

    });
});
