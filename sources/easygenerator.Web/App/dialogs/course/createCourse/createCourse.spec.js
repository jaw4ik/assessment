import viewModel from './createCourse';

import constants from 'constants';
import eventTracker from 'eventTracker';
import dialog from 'widgets/dialog/viewmodel';
import createCourseCommand from 'commands/createCourseCommand';
import localozationManager from 'localization/localizationManager';
import courseTitleStep from 'dialogs/course/createCourse/steps/courseTitleStep';
import courseTemplateStep from 'dialogs/course/createCourse/steps/courseTemplateStep';

describe('dialog course [createCourse]', function () {

    beforeEach(function () {
        spyOn(dialog, 'show');
        spyOn(eventTracker, 'publish');
        spyOn(courseTemplateStep, 'on');
        spyOn(courseTitleStep, 'on');
        spyOn(courseTemplateStep, 'off');
        spyOn(courseTitleStep, 'off');
        spyOn(dialog, 'on');
        spyOn(dialog, 'off');
    });

    describe('show:', function () {
        var createCourse = 'create course',
            callback = function() {};

        beforeEach(function () {
            spyOn(localozationManager, 'localize').and.returnValue(createCourse);
        });

        it('should set callback', function() {
            viewModel.show(callback);
            expect(viewModel.callback).toBe(callback);
        });
        
        it('should set courseTitleStep caption', function () {
            viewModel.show();
            expect(courseTitleStep.caption()).toBe(createCourse);
        });

        it('should set event category to undefined', function () {
            viewModel.show();
            expect(viewModel.eventCategory).toBeUndefined();
        });

        it('should call dialog show', function () {
            viewModel.show();
            expect(dialog.show).toHaveBeenCalledWith([courseTemplateStep, courseTitleStep], constants.dialogs.createCourse.settings);
        });

        it('should subscribe on courseTemplateStep.submitted event', function () {
            viewModel.show();
            expect(courseTemplateStep.on).toHaveBeenCalledWith(constants.dialogs.stepSubmitted, viewModel.courseTemplateStepSubmitted);
        });

        it('should subscribe on courseTitleStep.submitted event', function () {
            viewModel.show();
            expect(courseTitleStep.on).toHaveBeenCalledWith(constants.dialogs.stepSubmitted, viewModel.courseTitleStepSubmitted);
        });

        it('should subscribe on dialog.closed event', function () {
            viewModel.show();
            expect(dialog.on).toHaveBeenCalledWith(constants.dialogs.dialogClosed, viewModel.closed);
        });
    });

    describe('closed:', function () {
        it('should unsubscribe from courseTemplateStep.submitted event', function () {
            viewModel.closed();
            expect(courseTemplateStep.off).toHaveBeenCalledWith(constants.dialogs.stepSubmitted, viewModel.courseTemplateStepSubmitted);
        });

        it('should unsubscribe from courseTitleStep.submitted event', function () {
            viewModel.closed();
            expect(courseTitleStep.off).toHaveBeenCalledWith(constants.dialogs.stepSubmitted, viewModel.courseTitleStepSubmitted);
        });

        it('should unsubscribe from dialog.closed event', function () {
            viewModel.closed();
            expect(dialog.off).toHaveBeenCalledWith(constants.dialogs.dialogClosed, viewModel.closed);
        });
    });

    describe('courseTemplateStepSubmitted:', function () {
        var eventCategory = 'eventCategory';
        beforeEach(function () {
            spyOn(dialog, 'navigateToNextStep');
            viewModel.eventCategory = eventCategory;
        });

        it('should trigger \'Choose template and proceed\' event', function () {
            viewModel.courseTemplateStepSubmitted();
            expect(eventTracker.publish).toHaveBeenCalledWith('Choose template and proceed', eventCategory);
        });

        it('should call dialog.navigateToNextStep()', function () {
            viewModel.courseTemplateStepSubmitted();
            expect(dialog.navigateToNextStep).toHaveBeenCalled();
        });
    });

    describe('courseTitleStepSubmitted:', function () {
        var createCourseDefer,
            title = 'title',
            templateId = 'templateId',
            course = {
                id: 'courseId'
            },
            eventCategory = 'eventCategory';

        beforeEach(function () {
            createCourseDefer = Q.defer();
            spyOn(createCourseCommand, 'execute').and.returnValue(createCourseDefer.promise);
            courseTitleStep.title(title);
            spyOn(courseTemplateStep, 'getSelectedTemplateId').and.returnValue(templateId);
            spyOn(dialog, 'close');
            viewModel.eventCategory = eventCategory;
        });

        it('should trigger \'Define course title and proceed\' event', function () {
            viewModel.courseTitleStepSubmitted();
            expect(eventTracker.publish).toHaveBeenCalledWith('Define course title and proceed', eventCategory);
        });

        it('should set courseTitleStep.isProcessing to true', function () {
            courseTitleStep.isProcessing(false);
            viewModel.courseTitleStepSubmitted();
            expect(courseTitleStep.isProcessing()).toBeTruthy();
        });

        it('should create course', function () {
            viewModel.courseTitleStepSubmitted();
            expect(createCourseCommand.execute).toHaveBeenCalledWith(title, templateId);
        });

        describe('when course created', function () {
            beforeEach(function () {
                createCourseDefer.resolve(course);
            });

            it('should close dialog', function (done) {
                var promise = viewModel.courseTitleStepSubmitted();

                promise.fin(function () {
                    expect(dialog.close).toHaveBeenCalled();
                    done();
                });
            });

            describe('when callback is a function', function () {

                it('should call callback', function (done) {
                    viewModel.callback = function () { };
                    spyOn(viewModel, 'callback');

                    var promise = viewModel.courseTitleStepSubmitted();

                    promise.fin(function () {
                        expect(viewModel.callback).toHaveBeenCalledWith(course);
                        done();
                    });

                });

            });

            it('should set courseTitleStep.isProcessing to false', function (done) {
                courseTitleStep.isProcessing(true);
                var promise = viewModel.courseTitleStepSubmitted();

                promise.fin(function () {
                    expect(courseTitleStep.isProcessing()).toBeFalsy();
                    done();
                });
            });

        });

        describe('when failed to create course', function () {
            beforeEach(function () {
                createCourseDefer.reject();
            });

            it('should set courseTitleStep.isProcessing to false', function (done) {
                courseTitleStep.isProcessing(true);
                var promise = viewModel.courseTitleStepSubmitted();

                promise.fin(function () {
                    expect(courseTitleStep.isProcessing()).toBeFalsy();
                    done();
                });
            });
        });


    });
});
