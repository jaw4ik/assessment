define(['viewmodels/courses/courses'],
    function (viewModel) {
        "use strict";

        var
            app = require('durandal/app'),
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            dataContext = require('dataContext'),
            CourseModel = require('models/course'),
            constants = require('constants'),
            localizationManage = require('localization/localizationManager'),
            notify = require('notify');

        var
            template = { id: '0', name: 'name', image: 'img' },
            courses = [
                new CourseModel({
                    id: 'testId3',
                    title: 'Test Course 3',
                    objectives: [],
                    template: template
                }),
                new CourseModel({
                    id: 'testId2',
                    title: 'Test Course 2',
                    objectives: [],
                    template: template
                }),
                new CourseModel({
                    id: 'testId1',
                    title: 'Test Course 1',
                    objectives: [],
                    template: template
                })
            ];

        describe('viewModel [courses]', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('courses:', function () {

                it('should be observable', function () {
                    expect(viewModel.courses).toBeObservable();
                });

            });

            describe('states:', function () {

                it('should be defined', function () {
                    expect(viewModel.states).toBeDefined();
                });

            });

            describe('currentLanguage', function () {

                it('should be defined', function () {
                    expect(viewModel.currentLanguage).toBeDefined();
                });

            });

            describe('activate:', function () {

                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should take data from dataContext', function () {
                    dataContext.courses = courses;
                    viewModel.activate();
                    expect(viewModel.courses().length).toEqual(3);
                });

                it('should set current language', function () {
                    viewModel.currentLanguage = null;
                    viewModel.activate();
                    expect(viewModel.currentLanguage).toBe(localizationManage.currentLanguage);
                });

                describe('when previous showStatus is not set', function () {

                    var dataCourse;

                    beforeEach(function () {
                        dataContext.courses = [];
                        viewModel.activate();
                        viewModel.deactivate();

                        dataContext.courses = courses;
                        dataCourse = dataContext.courses[0];
                    });

                    describe('and deliveringState is \"Not started\"', function () {

                        beforeEach(function () {
                            dataCourse.deliveringState = constants.deliveringStates.notStarted;
                        });

                        it('should set current showStatus to \"false\"', function () {
                            viewModel.activate();
                            var viewCourse = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                            expect(viewCourse.showStatus()).toBe(false);
                        });

                    });

                    describe('and deliveringState is \"building\"', function () {

                        beforeEach(function () {
                            dataCourse.deliveringState = constants.deliveringStates.building;
                        });

                        it('should set current showStatus to \"true\"', function () {
                            viewModel.activate();
                            var viewCourse = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                            expect(viewCourse.showStatus()).toBe(true);
                        });

                    });

                    describe('and deliveringState is \"Failed\"', function () {

                        beforeEach(function () {
                            dataCourse.deliveringState = constants.deliveringStates.failed;
                        });

                        it('should set current showStatus to \"true\"', function () {
                            viewModel.activate();
                            var viewCourse = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                            expect(viewCourse.showStatus()).toBe(true);
                        });

                    });

                    describe('and deliveringState is \"Succeed\"', function () {

                        beforeEach(function () {
                            dataCourse.deliveringState = constants.deliveringStates.succeed;
                        });

                        it('should set current showStatus to \"true\"', function () {
                            viewModel.activate();
                            var viewCourse = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                            expect(viewCourse.showStatus()).toBe(true);
                        });

                    });

                });

                describe('when previous showStatus is \"false\"', function () {
                    var dataCourse,
                        viewCourse;

                    beforeEach(function () {
                        dataContext.courses = courses;
                        dataCourse = dataContext.courses[0];
                        viewModel.activate();

                        viewCourse = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                        viewCourse.showStatus(false);
                    });

                    describe('and previous deliveringState is \"Not started\"', function () {

                        beforeEach(function () {
                            viewCourse.deliveringState(constants.deliveringStates.notStarted);
                            viewModel.deactivate();
                        });

                        describe('and deliveringState is not changed', function () {

                            beforeEach(function () {
                                dataCourse.deliveringState = constants.deliveringStates.notStarted;
                            });

                            it('should set current showStatus to \"false\"', function () {
                                viewModel.activate();
                                var course = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                                expect(course.showStatus()).toBe(false);
                            });

                        });

                        describe('and deliveringState is changed', function () {

                            beforeEach(function () {
                                dataCourse.deliveringState = constants.deliveringStates.succeed;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var course = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                                expect(course.showStatus()).toBe(true);
                            });

                        });

                    });

                    describe('and deliveringState is \"building\"', function () {

                        beforeEach(function () {
                            viewCourse.deliveringState(constants.deliveringStates.building);
                            viewModel.deactivate();
                        });

                        describe('and deliveringState is not changed', function () {

                            beforeEach(function () {
                                dataCourse.deliveringState = constants.deliveringStates.building;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var course = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                                expect(course.showStatus()).toBe(true);
                            });

                        });

                        describe('and deliveringState is changed', function () {

                            beforeEach(function () {
                                dataCourse.deliveringState = constants.deliveringStates.succeed;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var course = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                                expect(course.showStatus()).toBe(true);
                            });

                        });

                    });

                    describe('and deliveringState is \"Failed\"', function () {

                        beforeEach(function () {
                            viewCourse.deliveringState(constants.deliveringStates.failed);
                            viewModel.deactivate();
                        });

                        describe('and deliveringState is not changed', function () {

                            beforeEach(function () {
                                dataCourse.deliveringState = constants.deliveringStates.failed;
                            });

                            it('should set current showStatus to \"false\"', function () {
                                viewModel.activate();
                                var course = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                                expect(course.showStatus()).toBe(false);
                            });

                        });

                        describe('and deliveringState is changed', function () {

                            beforeEach(function () {
                                dataCourse.deliveringState = constants.deliveringStates.succeed;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var course = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                                expect(course.showStatus()).toBe(true);
                            });

                        });

                    });

                    describe('and deliveringState is \"Succeed\"', function () {

                        beforeEach(function () {
                            viewCourse.deliveringState(constants.deliveringStates.succeed);
                            viewModel.deactivate();
                        });

                        describe('and deliveringState is not changed', function () {

                            beforeEach(function () {
                                dataCourse.deliveringState = constants.deliveringStates.succeed;
                            });

                            it('should set current showStatus to \"false\"', function () {
                                viewModel.activate();
                                var course = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                                expect(course.showStatus()).toBe(false);
                            });

                        });

                        describe('and deliveringState is changed', function () {

                            beforeEach(function () {
                                dataCourse.deliveringState = constants.deliveringStates.failed;
                            });

                            it('should set current showStatus to \"true\"', function () {
                                viewModel.activate();
                                var course = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                                expect(course.showStatus()).toBe(true);
                            });

                        });

                    });

                });

                describe('when previous showStatus is \"true\"', function () {
                    var dataCourse;

                    beforeEach(function () {
                        dataContext.courses = courses;
                        dataCourse = dataContext.courses[0];
                        viewModel.activate();
                        var viewCourse = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });

                        viewCourse.showStatus(true);
                        viewModel.deactivate();
                    });

                    it('should set current showStatus to \"true\"', function () {
                        viewModel.activate();

                        var viewCourse = _.find(viewModel.courses(), function (item) { return item.id == dataCourse.id; });
                        expect(viewCourse.showStatus()).toBe(true);
                    });

                });

            });

            describe('deactivate:', function () {

                it('should be a function', function () {
                    expect(viewModel.deactivate).toBeFunction();
                });

            });

            describe('navigateToCreation', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreation).toBeFunction();
                });

                it('should send event \"Navigate to create course\"', function () {
                    viewModel.navigateToCreation();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create course');
                });

                it('should navigate to #course/create', function () {
                    viewModel.navigateToCreation();
                    expect(router.navigate).toHaveBeenCalledWith('course/create');
                });

            });

            describe('navigateToDetails:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToDetails).toBeFunction();
                });

                it('should send event \"Navigate to course details\"', function () {
                    dataContext.courses = courses;
                    viewModel.navigateToDetails(courses[0]);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to course details');
                });

                it('should navigate to #course/id', function () {
                    dataContext.courses = courses;
                    viewModel.navigateToDetails(courses[0]);
                    expect(router.navigate).toHaveBeenCalledWith('course/' + courses[0].id);
                });

            });

            describe('navigateToObjectives:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToObjectives).toBeFunction();
                });

                it('should send event \"Navigate to objectives\"', function () {
                    viewModel.navigateToObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objectives');
                });

                it('should navigate to #objectives', function () {
                    viewModel.navigateToObjectives();
                    expect(router.navigate).toHaveBeenCalledWith('objectives');
                });

            });

            describe('toggleSelection:', function () {
                var course;

                beforeEach(function () {
                    course = {
                        isSelected: ko.observable()
                    };
                });

                it('should be a function', function () {
                    expect(viewModel.toggleSelection).toBeFunction();
                });

                it('should select course', function () {
                    course.isSelected(false);
                    viewModel.toggleSelection(course);
                    expect(course.isSelected()).toBe(true);
                });

                it('should send event \"Course unselected\" when was selected', function () {
                    course.isSelected(true);
                    viewModel.toggleSelection(course);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Course unselected');
                });

                it('should send event \"Course selected\" when was not selected', function () {
                    course.isSelected(false);
                    viewModel.toggleSelection(course);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Course selected');
                });

            });

            describe('enableDeleteCourses:', function () {

                it('should be computed', function () {
                    expect(viewModel.enableDeleteCourses).toBeComputed();
                });

                describe('when no course is selected', function () {

                    it('should be false', function () {
                        viewModel.courses([{ isSelected: ko.observable(false) }]);
                        expect(viewModel.enableDeleteCourses()).toBeFalsy();
                    });

                });

                describe('when 1 course is selected', function () {

                    it('should be true', function () {
                        viewModel.courses([{ isSelected: ko.observable(true) }]);
                        expect(viewModel.enableDeleteCourses()).toBeTruthy();
                    });

                });

                describe('when more than 1 courses are selected', function () {

                    it('should be false', function () {
                        viewModel.courses([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                        expect(viewModel.enableDeleteCourses()).toBeTruthy();
                    });

                });
            });

            describe('deleteSelectedCourses:', function () {

                it('should be function', function () {
                    expect(viewModel.deleteSelectedCourses).toBeFunction();
                });

                it('should send event \'Delete selected courses\'', function () {
                    viewModel.courses([{ isSelected: ko.observable(true), objectives: [] }]);
                    viewModel.deleteSelectedCourses();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected courses');
                });

                describe('when no courses are selected', function () {

                    it('should throw exception', function () {
                        viewModel.courses([]);

                        var f = function () {
                            viewModel.deleteSelectedCourses();
                        };
                        expect(f).toThrow();
                    });

                });

                describe('when more that 1 course are selected', function () {

                    it('should show error notification', function () {
                        viewModel.courses([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                        spyOn(notify, 'error');

                        viewModel.deleteSelectedCourses();
                        expect(notify.error).toHaveBeenCalled();
                    });

                });

                describe('when there is only 1 selected objective', function () {

                    var repository = require('repositories/courseRepository');

                    var removeCourse;

                    beforeEach(function () {
                        removeCourse = Q.defer();
                        spyOn(repository, 'removeCourse').andReturn(removeCourse.promise);
                    });

                    describe('and course has related learning objectives', function () {

                        beforeEach(function () {
                            viewModel.courses([{ isSelected: ko.observable(true), objectives: [{}] }]);
                            spyOn(notify, 'error');
                        });

                        it('should show error notification', function () {
                            viewModel.deleteSelectedCourses();
                            expect(notify.error).toHaveBeenCalled();
                        });

                        it('should not remove course from repository', function () {
                            viewModel.deleteSelectedCourses();
                            expect(repository.removeCourse).not.toHaveBeenCalled();
                        });

                    });

                    describe('and course has no related learning objectives', function () {

                        beforeEach(function () {
                            viewModel.courses([{ id: 'id', isSelected: ko.observable(true), objectives: [] }]);
                        });

                        it('should remove course from repository', function () {
                            viewModel.deleteSelectedCourses();
                            expect(repository.removeCourse).toHaveBeenCalledWith('id');
                        });

                        describe('and course was successfully removed from repository', function () {

                            it('should remove course from view model', function () {
                                viewModel.deleteSelectedCourses();

                                var promise = removeCourse.promise.fin(function () { });

                                removeCourse.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.courses().length).toBe(0);
                                });
                            });

                            it('should show saved notification', function () {
                                spyOn(notify, 'saved');
                                viewModel.deleteSelectedCourses();

                                var promise = removeCourse.promise.fin(function () { });
                                removeCourse.resolve();

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(notify.saved).toHaveBeenCalled();
                                });
                            });

                        });
                    });

                });

            });

            describe('publishCourse:', function () {
                var
                    course,
                    courseRepositoryGetByIdDefer,
                    courseRepositoryGetByIdPromise,
                    repository = require('repositories/courseRepository');

                beforeEach(function () {
                    course = {
                        id: 'testId3',
                        deliveringState: ko.observable(),
                        showStatus: ko.observable(),
                        isSelected: ko.observable(),
                        publishPackageExists: ko.observable(),
                        publish: function () {
                        }
                    };

                    spyOn(course, 'publish');

                    courseRepositoryGetByIdDefer = Q.defer();
                    courseRepositoryGetByIdPromise = courseRepositoryGetByIdDefer.promise;
                    spyOn(repository, 'getById').andReturn(courseRepositoryGetByIdPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.publishCourse).toBeFunction();
                });

                it('should send event \"Publish course\"', function () {
                    viewModel.publishCourse(course);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Publish course');
                });

                it('should reset item selection', function () {
                    course.isSelected(true);

                    viewModel.publishCourse(course);

                    expect(course.isSelected()).toBe(false);
                });

                it('should start publish of current course', function () {
                    courseRepositoryGetByIdDefer.resolve(course);
                    var promise = viewModel.publishCourse(course);

                    waitsFor(function () {
                        return !promise.isPending();
                    });

                    runs(function () {
                        expect(course.publish).toHaveBeenCalled();
                    });
                });

                describe('when publish is finished', function () {
                    beforeEach(function () {
                        course = {
                            id: 'testId3',
                            deliveringState: ko.observable(),
                            showStatus: ko.observable(),
                            isSelected: ko.observable(),
                            publishPackageExists: ko.observable(),
                            publish: function () {
                            }
                        };
                    });

                    describe('and publish failed', function () {

                        it('should show error notification', function () {
                            spyOn(notify, 'error');

                            var publishPromise = viewModel.publishCourse(course);

                            eventTracker.publish.reset();
                            courseRepositoryGetByIdDefer.reject('Course publish is failed');

                            waitsFor(function () {
                                return !publishPromise.isPending();
                            });

                            runs(function () {
                                expect(notify.error).toHaveBeenCalledWith('Course publish is failed');
                            });
                        });


                        it('should send event \'Course publish is failed\'', function () {
                            var publishPromise = viewModel.publishCourse(course);

                            eventTracker.publish.reset();
                            courseRepositoryGetByIdDefer.reject();

                            waitsFor(function () {
                                return !publishPromise.isPending();
                            });
                            runs(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Course publish is failed');
                            });
                        });

                    });

                });
            });

            describe('downloadCourse:', function () {

                var course;

                beforeEach(function () {
                    course = {
                        packageUrl: ko.observable('some url'),
                        isSelected: ko.observable(),
                        deliveringState: ko.observable('')
                    };

                    spyOn(router, 'download');
                });

                it('should be a function', function () {
                    expect(viewModel.downloadCourse).toBeFunction();
                });

                it('should send event \"Download course\"', function () {
                    viewModel.downloadCourse(course);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Download course');
                });
            });

            describe('enableOpenCourse:', function () {
                var course;

                beforeEach(function () {
                    course = { showStatus: ko.observable(), deliveringState: ko.observable(constants.deliveringStates.notStarted) };
                });

                it('should be a function', function () {
                    expect(viewModel.enableOpenCourse).toBeFunction();
                });

                it('should hide showStatus and so enable open course', function () {
                    course.showStatus(true);

                    viewModel.enableOpenCourse(course);

                    expect(course.showStatus()).toBe(false);
                });

                describe('when deliveringState or deliveringState equals building', function () {

                    beforeEach(function () {
                        course = { showStatus: ko.observable(), deliveringState: ko.observable(constants.deliveringStates.building) };
                    });

                    it('should not hide showStatus', function () {
                        course.showStatus(true);
                        viewModel.enableOpenCourse(course);
                        expect(course.showStatus()).toBe(true);
                    });

                });

                describe('when deliveringState or deliveringState equals publishing', function () {

                    beforeEach(function () {
                        course = { showStatus: ko.observable(), deliveringState: ko.observable(constants.deliveringStates.publishing) };
                    });

                    it('should not hide showStatus', function () {
                        course.showStatus(true);
                        viewModel.enableOpenCourse(course);
                        expect(course.showStatus()).toBe(true);
                    });

                });
            });

            describe('build events handling:', function () {

                describe('when course build was started', function () {

                    var courseVm;

                    beforeEach(function () {
                        courseVm = {
                            id: 'courseId',
                            deliveringState: ko.observable(constants.deliveringStates.notStarted),
                            showStatus: ko.observable(false)
                        };
                        viewModel.courses([courseVm]);
                    });

                    it('should change status of corresponding course to \'building\'', function () {
                        app.trigger(constants.messages.course.build.started, { id: courseVm.id });
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.building);
                    });

                    it('should show building status for corresponding course', function () {
                        app.trigger(constants.messages.course.build.started, { id: courseVm.id });
                        expect(courseVm.showStatus()).toBeTruthy();
                    });

                    it('should not change status of other courses', function () {
                        app.trigger(constants.messages.course.build.started, { id: '100500' });
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                    });

                    it('should not show building status for other courses', function () {
                        app.trigger(constants.messages.course.build.started, { id: '100500' });
                        expect(courseVm.showStatus()).toBeFalsy();
                    });

                });

                describe('when course build completed', function () {

                    var courseVm;

                    beforeEach(function () {
                        courseVm = {
                            id: 'courseId',
                            packageUrl: ko.observable('packageUrl'),
                            deliveringState: ko.observable(constants.deliveringStates.inProgress)
                        };
                        viewModel.courses([courseVm]);
                    });

                    it('should change status of the corresponding course to \'success\'', function () {
                        app.trigger(constants.messages.course.build.completed, { id: courseVm.id });
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.succeed);
                    });

                    it('should change packageUrl of the corresponding course', function () {
                        var packageUrl = "http://xxx.com";
                        app.trigger(constants.messages.course.build.completed, { id: courseVm.id, packageUrl: packageUrl });

                        expect(courseVm.packageUrl()).toEqual(packageUrl);
                    });

                    it('should not change status of other courses', function () {
                        app.trigger(constants.messages.course.build.completed, { id: '100500' });
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.inProgress);
                    });

                    it('should not change packageUrl of other courses', function () {
                        var packageUrl = "http://xxx.com";
                        app.trigger(constants.messages.course.build.completed, { id: '100500', packageUrl: packageUrl });

                        expect(courseVm.packageUrl()).toEqual('packageUrl');
                    });

                });

                describe('when course build failed', function () {

                    var courseVm;

                    beforeEach(function () {
                        courseVm = {
                            id: 'courseId',
                            packageUrl: ko.observable('packageUrl'),
                            deliveringState: ko.observable(constants.deliveringStates.inProgress),
                        };
                        viewModel.courses([courseVm]);
                    });

                    it('should change status of the corresponding course to \'failed\'', function () {
                        app.trigger(constants.messages.course.build.failed, courseVm.id);
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.failed);
                    });

                    it('should remove packageUrl of the corresponding course', function () {
                        app.trigger(constants.messages.course.build.failed, courseVm.id);
                        expect(courseVm.packageUrl()).toEqual("");
                    });

                    it('should not change status of other courses', function () {
                        app.trigger(constants.messages.course.build.failed, '100500');
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.inProgress);
                    });

                    it('should not remove packageUrl of other courses', function () {
                        app.trigger(constants.messages.course.build.failed, '100500');
                        expect(courseVm.packageUrl()).toEqual("packageUrl");
                    });

                });

            });

            describe('publish events handling:', function () {

                describe('when course publish was started', function () {

                    var courseVm;

                    beforeEach(function () {
                        courseVm = {
                            id: 'courseId',
                            deliveringState: ko.observable(constants.deliveringStates.notStarted),
                            showStatus: ko.observable(false)
                        };
                        viewModel.courses([courseVm]);
                    });

                    it('should change deliveringState of corresponding course to \'publishing\'', function () {
                        app.trigger(constants.messages.course.publish.started, { id: courseVm.id });
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.publishing);
                    });

                    it('should show deliveringState for corresponding course', function () {
                        app.trigger(constants.messages.course.publish.started, { id: courseVm.id });
                        expect(courseVm.showStatus()).toBeTruthy();
                    });

                    it('should not change deliveringState of other courses', function () {
                        app.trigger(constants.messages.course.publish.started, { id: '100500' });
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                    });

                    it('should not show deliveringState for other courses', function () {
                        app.trigger(constants.messages.course.publish.started, { id: '100500' });
                        expect(courseVm.showStatus()).toBeFalsy();
                    });

                });

                describe('when course publish completed', function () {

                    var courseVm;

                    beforeEach(function () {
                        courseVm = {
                            id: 'courseId',
                            publishedPackageUrl: ko.observable('packageUrl'),
                            deliveringState: ko.observable(constants.deliveringStates.inProgress)
                        };
                        viewModel.courses([courseVm]);
                    });

                    it('should change deliveringState of the corresponding course to \'success\'', function () {
                        app.trigger(constants.messages.course.publish.completed, { id: courseVm.id });
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.succeed);
                    });

                    it('should change publishedPackageUrl of the corresponding course', function () {
                        var publishedPackageUrl = "http://xxx.com";
                        app.trigger(constants.messages.course.publish.completed, { id: courseVm.id, publishedPackageUrl: publishedPackageUrl });

                        expect(courseVm.publishedPackageUrl()).toEqual(publishedPackageUrl);
                    });

                    it('should not change deliveringState of other courses', function () {
                        app.trigger(constants.messages.course.publish.completed, { id: '100500' });
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.inProgress);
                    });

                    it('should not change publishedPackageUrl of other courses', function () {
                        var publishedPackageUrl = "http://xxx.com";
                        app.trigger(constants.messages.course.publish.completed, { id: '100500', publishedPackageUrl: publishedPackageUrl });

                        expect(courseVm.publishedPackageUrl()).toEqual('packageUrl');
                    });

                });

                describe('when course publish failed', function () {

                    var courseVm;

                    beforeEach(function () {
                        courseVm = {
                            id: 'courseId',
                            publishedPackageUrl: ko.observable('packageUrl'),
                            deliveringState: ko.observable(constants.deliveringStates.inProgress),
                        };
                        viewModel.courses([courseVm]);
                    });

                    it('should change deliveringState of the corresponding course to \'failed\'', function () {
                        app.trigger(constants.messages.course.publish.failed, courseVm.id);
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.failed);
                    });

                    it('should remove publishedPackageUrl of the corresponding course', function () {
                        app.trigger(constants.messages.course.publish.failed, courseVm.id);
                        expect(courseVm.publishedPackageUrl()).toEqual("");
                    });

                    it('should not change deliveringState of other courses', function () {
                        app.trigger(constants.messages.course.publish.failed, '100500');
                        expect(courseVm.deliveringState()).toEqual(constants.deliveringStates.inProgress);
                    });

                    it('should not remove publishedPackageUrl of other courses', function () {
                        app.trigger(constants.messages.course.publish.failed, '100500');
                        expect(courseVm.publishedPackageUrl()).toEqual("packageUrl");
                    });

                });

            });

            describe('openPublishedCourse:', function () {

                it('should be a function', function () {
                    expect(viewModel.openPublishedCourse).toBeFunction();
                });

                beforeEach(function () {
                    spyOn(router, 'openUrl');
                });

                describe('when published package exists', function () {

                    it('should open published course link', function () {
                        var course = {
                            publishedPackageUrl: ko.observable('published course link'),
                            publishPackageExists: ko.computed(function () {
                                return true;
                            })
                        };

                        viewModel.openPublishedCourse(course);

                        expect(router.openUrl).toHaveBeenCalledWith('published course link');
                    });

                });

                describe('when published package does not exist', function () {

                    it('should not open published course link', function () {
                        var course = {
                            publishedPackageUrl: ko.observable('published course link'),
                            publishPackageExists: ko.computed(function () {
                                return false;
                            })
                        };

                        viewModel.openPublishedCourse(course);

                        expect(router.openUrl).not.toHaveBeenCalled();
                    });

                });

            });

        });
    }
);