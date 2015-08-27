define(['dialogs/course/changeTemplate/changeTemplate'], function (viewModel) {
    "use strict";

    var
        constants = require('constants'),
        eventTracker = require('eventTracker'),
        dialog = require('widgets/dialog/viewmodel'),
        courseRepository = require('repositories/courseRepository'),
        templateSelector = require('dialogs/course/common/templateSelector/templateSelector'),
        app = require('durandal/app');

    describe('dialog course [changeTemplate]', function () {

        beforeEach(function () {
            spyOn(dialog, 'show');
            spyOn(eventTracker, 'publish');
            spyOn(app, 'trigger');
        });

        describe('templateId:', function () {
            it('should be observable', function () {
                expect(viewModel.templateId).toBeObservable();
            });
        });

        describe('isProcessing:', function () {
            it('should be observable', function () {
                expect(viewModel.isProcessing).toBeObservable();
            });
        });

        describe('templateSelector:', function () {
            it('should be defined', function () {
                expect(viewModel.templateSelector).toBe(templateSelector);
            });
        });

        describe('show:', function () {
            var courseId = 'courseId',
                templateId = 'templateId';

            it('should set courseId', function () {
                viewModel.courseId = null;
                viewModel.show(courseId, templateId);
                expect(viewModel.courseId).toBe(courseId);
            });

            it('should set templateId', function () {
                viewModel.templateId(null);
                viewModel.show(courseId, templateId);
                expect(viewModel.templateId()).toBe(templateId);
            });

            it('should call dialog show', function () {
                viewModel.show(courseId, templateId);
                expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.changeCourseTemplate.settings);
            });
        });

        describe('submit:', function () {
            var updateTemplateDefer,
                courseId = 'courseId',
                template = {
                    id: 'templateId',
                    isCustom: false,
                    name: 'name'
                };

            beforeEach(function () {
                updateTemplateDefer = Q.defer();
                spyOn(courseRepository, 'updateCourseTemplate').and.returnValue(updateTemplateDefer.promise);
                spyOn(dialog, 'close');
                spyOn(templateSelector, 'selectedTemplate').and.returnValue(template);
                viewModel.courseId = courseId;
            });

            describe('when template is custom', function () {
                beforeEach(function () {
                    template.isCustom = true;
                });

                it('should trigger event', function () {
                    viewModel.submit();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change course template to \'custom\'');
                });
            });

            describe('when template is not custom', function () {
                beforeEach(function () {
                    template.isCustom = false;
                });

                it('should trigger event', function () {
                    viewModel.submit();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change course template to \'' + template.name + '\'');
                });
            });

            describe('when selected template is current template', function () {
                beforeEach(function () {
                    viewModel.templateId(template.id);
                });

                it('should close dialog', function (done) {
                    var promise = viewModel.submit();
                    promise.fin(function () {
                        expect(dialog.close).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when selected template is not current template', function () {
                beforeEach(function () {
                    viewModel.templateId('some id');
                });

                it('should set isProcessing to true', function () {
                    viewModel.isProcessing(false);
                    viewModel.submit();
                    expect(viewModel.isProcessing()).toBeTruthy();
                });

                it('should update course template', function () {
                    viewModel.submit();
                    expect(courseRepository.updateCourseTemplate).toHaveBeenCalledWith(courseId, template.id);
                });

                describe('and when course template updated', function () {
                    beforeEach(function () {
                        updateTemplateDefer.resolve(template);
                    });

                    it('should close dialog', function (done) {
                        var promise = viewModel.submit();

                        promise.fin(function () {
                            expect(dialog.close).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should trigger app event', function (done) {
                        var promise = viewModel.submit();

                        promise.fin(function () {
                            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.templateUpdated + viewModel.courseId, template);
                            done();
                        });
                    });

                    it('should set isProcessing to false', function () {
                        viewModel.isProcessing(true);
                        var promise = viewModel.submit();

                        promise.fin(function () {
                            expect(viewModel.isProcessing()).toBeFalsy();
                            done();
                        });
                    });
                });
            });
            
            describe('when failed to update course template', function () {
                beforeEach(function () {
                    updateTemplateDefer.reject();
                });

                it('should set isProcessing to false', function () {
                    viewModel.isProcessing(true);
                    var promise = viewModel.submit();

                    promise.fin(function () {
                        expect(viewModel.isProcessing()).toBeFalsy();
                        done();
                    });
                });

                it('should close dialog', function (done) {
                    var promise = viewModel.submit();

                    promise.fin(function () {
                        expect(dialog.close).toHaveBeenCalled();
                        done();
                    });
                });
            });
        });
    });

});