define(['dialogs/course/delete/deleteCourse'], function (viewModel) {

    var eventTracker = require('eventTracker'),
        constants = require('constants'),
        courseRepository = require('repositories/courseRepository'),
        dialog = require('widgets/dialog/viewmodel');

    describe('dialog [deleteCourse]', function () {

        var course = {
            title: 'title',
            id: 'id'
        };

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(dialog, 'show');
            spyOn(dialog, 'close');
        });

        describe('isDeleting:', function () {
            it('should be observable', function () {
                expect(viewModel.isDeleting).toBeObservable();
            });
        });

        describe('courseId:', function () {
            it('should be defined', function () {
                expect(viewModel.courseId).toBeDefined();
            });
        });

        describe('courseTitle:', function () {
            it('should be observable', function () {
                expect(viewModel.courseTitle).toBeObservable();
            });
        });

        describe('show:', function () {

            it('should set courseId', function () {
                viewModel.courseId = '';
                viewModel.show(course.id, course.title);
                expect(viewModel.courseId).toBe(course.id);
            });

            it('should set courseTitle', function () {
                viewModel.courseTitle('');
                viewModel.show(course.id, course.title);
                expect(viewModel.courseTitle()).toBe(course.title);
            });

            it('should show dialog', function () {
                viewModel.show(course.id, course.title);
                expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.deleteCourse.settings);
            });
        });

        describe('cancel:', function () {
            it('should publish \'Cancel delete course\' event', function () {
                viewModel.cancel();
                expect(eventTracker.publish).toHaveBeenCalledWith('Cancel delete course');
            });

            it('should close dialog', function () {
                viewModel.cancel();
                expect(dialog.close).toHaveBeenCalled();
            });
        });

        describe('deleteCourse:', function () {
            var dfd = Q.defer();
            beforeEach(function () {
                viewModel.courseId = course.id;
                spyOn(courseRepository, 'removeCourse').and.returnValue(dfd.promise);
            });

            it('should set isDeleting to true', function () {
                viewModel.isDeleting(false);
                viewModel.deleteCourse();
                expect(viewModel.isDeleting()).toBeTruthy();
            });

            it('should publish \'Confirm delete course\' event', function () {
                viewModel.deleteCourse();
                expect(eventTracker.publish).toHaveBeenCalledWith('Confirm delete course');
            });

            describe('when learning path deleted successfully', function () {
                beforeEach(function () {
                    dfd.resolve();
                });

                it('should close dialog', function (done) {
                    viewModel.deleteCourse();
                    courseRepository.removeCourse().fin(function () {
                        expect(dialog.close).toHaveBeenCalled();
                        done();
                    });
                });

                it('should set isDeleting to false', function (done) {
                    viewModel.isDeleting(true);
                    viewModel.deleteCourse();
                    courseRepository.removeCourse().fin(function () {
                        done();
                        expect(viewModel.isDeleting()).toBeFalsy();
                    });
                });
            });
        });
    });

});