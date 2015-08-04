define(['viewmodels/learningPaths/learningPath/details'], function (viewModel) {
    "use strict";
    var
        getLearningPathByIdQuery = require('viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery'),
        router = require('plugins/router'),
        constants = require('constants'),
        eventTracker = require('eventTracker'),
        courseSelector = require('viewmodels/learningPaths/courseSelector/courseSelector'),
        localizationManager = require('localization/localizationManager'),
        app = require('durandal/app'),
        courseRepository = require('repositories/courseRepository'),
        notify = require('notify'),
        addCourseCommand = require('viewmodels/learningPaths/learningPath/commands/addCourseCommand'),
        removeCourseCommand = require('viewmodels/learningPaths/learningPath/commands/removeCourseCommand'),
        updateCoursesOrderCommand = require('viewmodels/learningPaths/learningPath/commands/updateCoursesOrderCommand')
    ;

    describe('viewModel [learningPath details]', function () {
        var learningPath,
            getLearnigPathDefer;

        beforeEach(function () {
            getLearnigPathDefer = Q.defer();
            spyOn(app, 'on');
            spyOn(app, 'off');
            spyOn(app, 'trigger');
            spyOn(notify, 'saved');
            spyOn(router, 'navigate');
            spyOn(eventTracker, 'publish');
            spyOn(courseSelector, 'expand');
            spyOn(courseSelector, 'collapse');
            spyOn(getLearningPathByIdQuery, 'execute').and.returnValue(getLearnigPathDefer.promise);
            learningPath = {
                id: 'id',
                title: 'title',
                courses: [{ id: '0', template: {} }, { id: '1', template: {} }]
            };
        });

        describe('activate:', function () {
            it('should set learning path id', function () {
                viewModel.id = null;
                viewModel.activate(learningPath.id);
                expect(viewModel.id).toBe(learningPath.id);
            });

            it('should set current language', function () {
                var lang = 'en';
                viewModel.currentLanguage = '';
                localizationManager.currentLanguage = lang;
                viewModel.activate(learningPath.id);
                expect(viewModel.currentLanguage).toBe(lang);
            });

            it('should subscribe on learningPath.courseSelector.courseSelected event', function () {
                viewModel.activate(learningPath.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseSelected, viewModel.addCourse);
            });

            it('should subscribe on learningPath.courseSelector.courseDeselected event', function () {
                viewModel.activate(learningPath.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseDeselected, viewModel.removeCourse);
            });

            it('should subscribe on learningPath.removeCourse event', function () {
                viewModel.activate(learningPath.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
            });

            it('should subscribe on course.titleUpdatedByCollaborator event', function () {
                viewModel.activate(learningPath.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);
            });

            describe('when received learning path', function () {
                beforeEach(function () {
                    getLearnigPathDefer.resolve(learningPath);
                });

                it('should set courses', function (done) {
                    viewModel.courses([]);
                    viewModel.activate(learningPath.id).fin(function () {
                        expect(viewModel.courses().length).toBe(learningPath.courses.length);
                        done();
                    });
                });

                it('should set course selector isExpaneded to false', function (done) {
                    viewModel.courseSelector.isExpanded(true);
                    viewModel.activate(learningPath.id).fin(function () {
                        expect(viewModel.courseSelector.isExpanded()).toBeFalsy();
                        done();
                    });
                });

                describe('when there are no courses in the learning path', function () {
                    beforeEach(function () {
                        learningPath.courses = [];
                    });

                    it('should set course selector isExpaneded to true', function (done) {
                        viewModel.courseSelector.isExpanded(false);
                        viewModel.activate(learningPath.id).fin(function () {
                            expect(viewModel.courseSelector.isExpanded()).toBeTruthy();
                            done();
                        });
                    });
                });
            });
        });

        describe('deactivate:', function () {
            it('should unsubscribe on learningPath.courseSelector.courseSelected event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseSelected, viewModel.addCourse);
            });

            it('should unsubscribe on learningPath.courseSelector.courseDeselected event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseDeselected, viewModel.removeCourse);
            });

            it('should unsubscribe on learningPath.removeCourse event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
            });

            it('should unsubscribe from course.titleUpdatedByCollaborator event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);
            });
        });

        describe('back:', function () {
            it('should publish \'Navigate to learning paths\' event', function () {
                viewModel.back();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to learning paths');
            });

            it('should navigate to learning paths', function () {
                viewModel.back();
                expect(router.navigate).toHaveBeenCalledWith('#learningpaths');
            });
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(viewModel.id).toBeDefined();
            });
        });

        describe('currentLanguage:', function () {
            it('should be defined', function () {
                expect(viewModel.currentLanguage).toBeDefined();
            });
        });

        describe('isSortingEnabled:', function () {
            describe('when courses count > 1', function () {
                it('should be true', function() {
                    viewModel.courses([{}, {}]);
                    expect(viewModel.isSortingEnabled()).toBeTruthy();
                });
            });

            describe('when courses count == 1', function () {
                it('should be true', function () {
                    viewModel.courses([{}]);
                    expect(viewModel.isSortingEnabled()).toBeFalsy();
                });
            });

            describe('when courses count == 0', function () {
                it('should be true', function () {
                    viewModel.courses([]);
                    expect(viewModel.isSortingEnabled()).toBeFalsy();
                });
            });
        });

        describe('addCourses:', function () {
            it('should publish \'Show courses available for the learning path (Add courses)\' event', function () {
                viewModel.addCourses();
                expect(eventTracker.publish).toHaveBeenCalledWith('Show courses available for the learning path (Add courses)');
            });

            it('should expand course selector', function () {
                viewModel.addCourses();
                expect(courseSelector.expand).toHaveBeenCalled();
            });
        });

        describe('finishAddingCourses:', function () {
            it('should publish \'Hide courses available for the learning path (Done)\' event', function () {
                viewModel.finishAddingCourses();
                expect(eventTracker.publish).toHaveBeenCalledWith('Hide courses available for the learning path (Done)');
            });

            it('should collapse course selector', function () {
                viewModel.finishAddingCourses();
                expect(courseSelector.collapse).toHaveBeenCalled();
            });
        });

        describe('addCourse:', function () {
            var course = { id: 'id', template: {} },
                getCourseDefer,
                addCourseDefer;

            beforeEach(function () {
                getCourseDefer = Q.defer();
                addCourseDefer = Q.defer();
                spyOn(courseRepository, 'getById').and.returnValue(getCourseDefer.promise);
                spyOn(addCourseCommand, 'execute').and.returnValue(addCourseDefer.promise);
            });

            it('should publish \'Add course to the learning path\' event', function () {
                viewModel.addCourse(course);
                expect(eventTracker.publish).toHaveBeenCalledWith('Add course to the learning path');
            });

            describe('when course received', function () {
                beforeEach(function () {
                    getCourseDefer.resolve(course);
                });

                it('should push course to courses collection', function (done) {
                    viewModel.courses([]);
                    viewModel.addCourse(course);
                    courseRepository.getById(course.id).fin(function () {
                        expect(viewModel.courses().length).toBe(1);
                        done();
                    });
                });

                describe('and when course added', function () {
                    beforeEach(function () {
                        addCourseDefer.resolve();
                    });

                    it('should show saved notification', function (done) {
                        viewModel.addCourse(course);
                        addCourseCommand.execute(viewModel.id, course.id).fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });
                });
            });
        });

        describe('removeCourse:', function () {
            var course = { id: 'id', template: {} },
                removeCourseDefer;

            beforeEach(function () {
                removeCourseDefer = Q.defer();
                spyOn(removeCourseCommand, 'execute').and.returnValue(removeCourseDefer.promise);
            });

            it('should publish \'Remove course from the learning path\' event', function () {
                viewModel.removeCourse(course.id);
                expect(eventTracker.publish).toHaveBeenCalledWith('Remove course from the learning path');
            });

            it('should remove course from courses collection', function () {
                viewModel.courses([course]);
                viewModel.removeCourse(course.id);
                expect(viewModel.courses().length).toBe(0);
            });

            describe('when courseSelector is collapsed', function () {
                beforeEach(function () {
                    viewModel.courseSelector.isExpanded(false);
                });

                describe('and when course was the last in collection', function () {
                    beforeEach(function () {
                        viewModel.courses([course]);
                    });

                    it('should expand course selector', function () {
                        viewModel.removeCourse(course.id);
                        expect(viewModel.courseSelector.expand).toHaveBeenCalled();
                    });
                });
            });

            describe('and when course removed', function () {
                beforeEach(function () {
                    removeCourseDefer.resolve();
                });

                it('should show saved notification', function (done) {
                    viewModel.removeCourse(course.id);
                    removeCourseCommand.execute(viewModel.id, course.id).fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });

        describe('updateCoursesOrder:', function () {
            var updateCoursesOrderDefer;

            beforeEach(function () {
                updateCoursesOrderDefer = Q.defer();
                spyOn(updateCoursesOrderCommand, 'execute').and.returnValue(updateCoursesOrderDefer.promise);
            });

            it('should publish \'Change order of courses\' event', function () {
                viewModel.updateCoursesOrder();
                expect(eventTracker.publish).toHaveBeenCalledWith('Change order of courses');
            });

            describe('when courses order updated successfully', function () {
                beforeEach(function () {
                    updateCoursesOrderDefer.resolve();
                });

                it('should show saved notification', function (done) {
                    viewModel.updateCoursesOrder();
                    updateCoursesOrderCommand.execute(viewModel.id, viewModel.courses()).fin(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });

        describe('courseTitleUpdated:', function () {
            var courseBrief = {
                id: 'id',
                title: ko.observable('')
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