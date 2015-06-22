define(['viewmodels/learningPaths/courseSelector/courseBrief'], function (ctor) {
    "use strict";

    var app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('viewModel learning path course selector [courseBrief]', function () {
        var course = {
            id: 'id',
            title: 'title',
            createdOn: new Date()
        },
            viewModel;

        beforeEach(function () {
            spyOn(app, 'trigger');
            viewModel = ctor(course);
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(viewModel.title()).toBe(course.title);
            });
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(viewModel.id).toBe(course.id);
            });
        });

        describe('createdOn:', function () {
            it('should be defined', function () {
                expect(viewModel.createdOn).toBe(course.createdOn);
            });
        });

        describe('isSelected:', function () {
            it('should be observable', function () {
                expect(viewModel.isSelected).toBeObservable();
            });
        });

        describe('toggleSelection:', function () {
            describe('when isSelected is true', function () {
                beforeEach(function () {
                    viewModel.isSelected(true);
                });

                it('should set isSelected false', function () {
                    viewModel.toggleSelection();
                    expect(viewModel.isSelected()).toBeFalsy();
                });

                it('should trigger learningPath.courseSelector.courseDeselected app event', function () {
                    viewModel.toggleSelection();
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseDeselected, course.id);
                });
            });

            describe('when isExpanded is false', function () {
                beforeEach(function () {
                    viewModel.isSelected(false);
                });

                it('should set isSelected true', function () {
                    viewModel.toggleSelection();
                    expect(viewModel.isSelected()).toBeTruthy();
                });

                it('should trigger learningPath.courseSelector.courseSelected app event', function () {
                    viewModel.toggleSelection();
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.learningPath.courseSelector.courseSelected, course.id);
                });
            });
        });

    });

});