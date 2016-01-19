define(['viewmodels/learningPaths/courseSelector/courseSelector'], function (viewModel) {
    "use strict";

    var
        getOwnedCoursesQuery = require('viewmodels/learningPaths/courseSelector/queries/getOwnedCoursesQuery'),
        getLearningPathByIdQuery = require('viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery'),
        app = require('durandal/app'),
        constants = require('constants'),
        courseFilter = require('viewmodels/learningPaths/courseSelector/courseFilter')
    ;


    describe('viewmodel learning path [courseSelector]', function () {

        beforeEach(function () {
            spyOn(app, 'on');
            spyOn(app, 'off');
        });

        describe('isExpanded:', function () {
            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });
        });

        describe('courses:', function () {
            it('should be observable array', function () {
                expect(viewModel.courses).toBeObservableArray();
            });
        });

        describe('filteredCourses:', function () {
            var courses = [
                {
                    id: '0',
                    title: ko.observable('title'),
                    createdOn: new Date(1)
                },
                {
                    id: '1',
                    title: ko.observable('courseTitle'),
                    createdOn: new Date(1)
                },
                {
                    id: '1',
                    title: ko.observable('trololo'),
                    createdOn: new Date(1)
                }
            ];

            beforeEach(function () {
                viewModel.courses(courses);
            });

            describe('when filter does not have a value', function () {
                beforeEach(function () {
                    viewModel.filter.value('');
                });

                it('should return courses collection', function () {
                    expect(viewModel.filteredCourses()).toBe(courses);
                });
            });

            describe('when filter has value', function () {
                describe('and when value is in upper case', function () {
                    beforeEach(function () {
                        viewModel.filter.value('TITLE');
                    });

                    it('should courses collection', function () {
                        expect(viewModel.filteredCourses().length).toBe(2);
                        expect(viewModel.filteredCourses()[0].title()).toBe(courses[0].title());
                        expect(viewModel.filteredCourses()[1].title()).toBe(courses[1].title());
                    });
                });

                describe('and when value is in lower case', function () {
                    beforeEach(function () {
                        viewModel.filter.value('title');
                    });

                    it('should return filtered courses collection', function () {
                        expect(viewModel.filteredCourses().length).toBe(2);
                        expect(viewModel.filteredCourses()[0].title()).toBe(courses[0].title());
                        expect(viewModel.filteredCourses()[1].title()).toBe(courses[1].title());
                    });
                });
            });
        });

        describe('expand:', function () {
            it('should clear course filter', function () {
                spyOn(courseFilter, 'clear');
                viewModel.expand();
                expect(courseFilter.clear).toHaveBeenCalled();
            });

            it('should set isExpanded to true', function () {
                viewModel.isExpanded(false);
                viewModel.expand();
                expect(viewModel.isExpanded()).toBeTruthy();
            });
        });

        describe('collapse:', function () {
            it('should set isExpanded to false', function () {
                viewModel.isExpanded(true);
                viewModel.collapse();
                expect(viewModel.isExpanded()).toBeFalsy();
            });
        });

        describe('activate:', function () {
            var getCoursesDefer,
                getLearningPathDefer,
                courses = [
                {
                    id: '0',
                    createdOn: new Date(1)
                },
                {
                    id: '1',
                    createdOn: new Date(1)
                }
                ],
                learningPath = {
                    entities: [courses[0]]
                };

            beforeEach(function () {
                getCoursesDefer = Q.defer();
                getLearningPathDefer = Q.defer();
                spyOn(getOwnedCoursesQuery, 'execute').and.returnValue(getCoursesDefer.promise);
                spyOn(getLearningPathByIdQuery, 'execute').and.returnValue(getLearningPathDefer.promise);
            });

            it('should subscribe on learningPath.removeCourse event', function () {
                viewModel.activate();
                expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, viewModel.courseRemovedFromPath);
            });

            it('should subscribe on course.titleUpdatedByCollaborator event', function () {
                viewModel.activate();
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);
            });

            describe('when learning path retrieved', function () {
                beforeEach(function () {
                    getLearningPathDefer.resolve(learningPath);
                });

                describe('when courses retrieved', function () {
                    beforeEach(function () {
                        getCoursesDefer.resolve(courses);
                    });

                    it('should set courses ordered by created on', function (done) {
                        viewModel.courses([]);
                        viewModel.activate().fin(function () {
                            expect(viewModel.courses().length).toBe(courses.length);
                            expect(viewModel.courses()[0].createdOn.toLocaleString()).toBe(courses[1].createdOn.toLocaleString());
                            expect(viewModel.courses()[1].createdOn.toLocaleString()).toBe(courses[0].createdOn.toLocaleString());
                            done();
                        });
                    });

                    it('should set correct isSelected field for each course', function (done) {
                        viewModel.courses([]);
                        viewModel.activate().fin(function () {
                            expect(viewModel.courses().length).toBe(courses.length);
                            expect(viewModel.courses()[0].isSelected()).toBeTruthy();
                            expect(viewModel.courses()[1].isSelected()).toBeFalsy();
                            done();
                        });
                    });
                });
            });

        });

        describe('deactivate:', function () {
            it('should unsubscribe from learningPath.removeCourse event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, viewModel.courseRemovedFromPath);
            });

            it('should unsubscribe from course.titleUpdatedByCollaborator event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);
            });

        });

        describe('courseRemovedFromPath:', function () {
            var courseBrief = {
                id: 'id',
                title: ko.observable(''),
                isSelected: ko.observable(true)
            };

            it('should set course isSelected to false', function () {
                viewModel.courses([courseBrief]);
                viewModel.courseRemovedFromPath(courseBrief.id);
                expect(courseBrief.isSelected()).toBeFalsy();
            });
        });

        describe('courseAddedToPath', function() {
            var course = {
                id: 'id'
            };

            it('should be function', function () {
                expect(viewModel.courseAddedToPath).toBeFunction();
            });

            it('should add course to selector', function() {
                viewModel.courseAddedToPath(course);
                expect(viewModel.courses()[0].id).toBe(course.id);
                expect(viewModel.courses()[0].isSelected()).toBeTruthy();
            });

        });

        describe('courseTitleUpdated:', function () {
            var courseBrief = {
                id: 'id',
                title: ko.observable(''),
                isSelected: ko.observable(true)
            },
                course = {
                    id: courseBrief.id,
                    title: 'title'
                };

            it('should update course title', function () {
                courseBrief.title('');
                viewModel.courses([courseBrief]);
                viewModel.courseTitleUpdated(course);
                expect(courseBrief.title()).toBe(course.title);
            });

            it('should not throw when course not found in collection', function () {
                viewModel.courses([]);
                var f = function () {
                    viewModel.courseTitleUpdated(course);
                };

                expect(f).not.toThrow();
            });
        });

    });

});