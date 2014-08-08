define(['dialogs/shareCourse/shareCourse'], function (viewModel) {

    "use strict";

    var repository = require('repositories/courseRepository'),
        router = require('plugins/router'),
        Course = require('models/course');

    describe('dialog [shareCourse]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('isShown:', function () {
            it('should be observable', function () {
                expect(viewModel.isShown).toBeObservable();
            });
        });

        describe('publishAction:', function () {
            it('should be observable', function () {
                expect(viewModel.publishAction).toBeObservable();
            });
        });

        describe('states:', function () {
            it('should be defined', function () {
                expect(viewModel.states).toBeDefined();
            });
        });

        describe('show:', function () {

            var getCourse,
                courseId = 'courseId';

            beforeEach(function () {
                getCourse = Q.defer();
                spyOn(repository, 'getById').and.returnValue(getCourse.promise);;
                router.routeData({ courseId: courseId });
            });

            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            describe('and when course is received', function () {

                beforeEach(function () {
                    getCourse.resolve(new Course({ id: courseId }));
                });

                it('should set isShown to true', function (done) {
                    viewModel.isShown(false);
                    viewModel.show().fin(function () {
                        expect(viewModel.isShown()).toBeTruthy();
                        done();
                    });
                });

                it('should define publishAction', function (done) {
                    viewModel.publishAction(null);

                    viewModel.show().fin(function () {
                        expect(viewModel.publishAction()).toBeDefined();
                        done();
                    });
                });
            });
        });

        describe('hide:', function () {

            it('should be function', function () {
                expect(viewModel.hide).toBeFunction();
            });

            it('should set isShown to false', function () {
                viewModel.isShown(true);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
            });

        });

    });

});