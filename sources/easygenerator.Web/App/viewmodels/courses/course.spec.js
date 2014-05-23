define(['viewmodels/courses/course'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        courseRepository = require('repositories/courseRepository'),
        clientContext = require('clientContext'),
        ping = require('ping'),
        readCourseViewModel = require('viewmodels/courses/course.read'),
        writeCourseViewModel = require('viewmodels/courses/course.write'),
        userContext = require('userContext')
    ;

    describe('viewModel [course]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('backButtonData:', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
            });

            it('should be defined', function () {
                expect(viewModel.backButtonData).toBeDefined();

                expect(viewModel.backButtonData.url).toEqual('courses');
            });

            it('should send \'Navigate to courses\' event when callback is called', function () {
                viewModel.backButtonData.callback();

                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
            });

        });

        describe('canActivate:', function () {

            beforeEach(function () {
                spyOn(ping, 'execute');
            });

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            it('should execute ping', function () {
                viewModel.canActivate();

                expect(ping.execute).toHaveBeenCalled();
            });

        });

        describe('activate:', function () {

            var courseId = 'Some id';

            var getCourseByIdDefer;

            beforeEach(function () {
                getCourseByIdDefer = Q.defer();

                spyOn(courseRepository, 'getById').and.returnValue(getCourseByIdDefer.promise);
                spyOn(clientContext, 'set');
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate(courseId)).toBePromise();
            });

            it('should get course from repository', function (done) {
                var promise = viewModel.activate(courseId);

                promise.fin(function () {
                    expect(courseRepository.getById).toHaveBeenCalledWith(courseId);
                    done();
                });

                getCourseByIdDefer.reject('Bad day today');
            });

            describe('when course not found in repository', function () {

                it('should reject promise', function (done) {
                    var promise = viewModel.activate(courseId);

                    promise.fin(function () {
                        expect(router.activeItem.settings.lifecycleData).toEqual({ redirect: '404' });
                        expect(promise).toBeRejectedWith('Bad day today');
                        done();
                    });

                    getCourseByIdDefer.reject('Bad day today');
                });

            });

            describe('when course received', function () {

                var userEmail = 'some@user.com';
                var course = {
                    id: courseId,
                    createdBy: userEmail
                };

                it('should update client context', function (done) {
                    var promise = viewModel.activate(courseId);

                    promise.fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastVistedCourse', 'some new id');
                        expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', null);
                        done();
                    });

                    getCourseByIdDefer.resolve({ id: 'some new id' });
                });

                describe('when user has write access to course', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            email: userEmail
                        };

                        spyOn(writeCourseViewModel, 'initialize');
                    });

                    it('should set write viewModel for course', function (done) {
                        var promise = viewModel.activate(courseId);

                        promise.fin(function () {
                            expect(viewModel.courseModule).toBe(writeCourseViewModel);
                            expect(writeCourseViewModel.initialize).toHaveBeenCalledWith(course);
                            done();
                        });

                        getCourseByIdDefer.resolve(course);
                    });

                });

                describe('when user has read access to course', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            email: userEmail + 'blablabla'
                        };

                        spyOn(readCourseViewModel, 'initialize');
                    });

                    it('should set read viewModel for course', function (done) {
                        var promise = viewModel.activate(courseId);

                        promise.fin(function () {
                            expect(viewModel.courseModule).toBe(readCourseViewModel);
                            expect(readCourseViewModel.initialize).toHaveBeenCalledWith(course);
                            done();
                        });

                        getCourseByIdDefer.resolve(course);
                    });

                });

            });

        });

    });

});
