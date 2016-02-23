import viewModel from './changeTemplate';

import constants from 'constants';
import eventTracker from 'eventTracker';
import dialog from 'widgets/dialog/viewmodel';
import courseRepository from 'repositories/courseRepository';
import app from 'durandal/app';

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
            expect(viewModel.templateSelector).toBeDefined();
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

        it('should trigger event', function () {
            viewModel.show(courseId, templateId);
            expect(eventTracker.publish).toHaveBeenCalledWith('Open \'change template\' dialog');
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
            spyOn(viewModel.templateSelector, 'selectedTemplate').and.returnValue(template);
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

                it('should set isProcessing to false', function (done) {
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

            it('should set isProcessing to false', function (done) {
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
