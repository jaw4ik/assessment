define([
    'constants', 'dialogs/course/createCourse/steps/courseTitleStep', 'dialogs/course/createCourse/steps/courseTemplateStep', 'widgets/dialog/viewmodel',
    'commands/createCourseCommand', 'eventTracker', 'localization/localizationManager'],
    function (constants, courseTitleStep, courseTemplateStep, dialog, createCourseCommand, eventTracker, localizationManager) {
        "use strict";

        var events = {
            chooseTemplateAndProceed: 'Choose template and proceed',
            defineCourseTitleAndProceed: 'Define course title and proceed'
        };

        var viewModel = {
            show: show,
            callback: null,
            closed: closed,
            courseTemplateStepSubmitted: courseTemplateStepSubmitted,
            courseTitleStepSubmitted: courseTitleStepSubmitted,
            eventCategory: undefined
        };

        return viewModel;

        function show(callback) {
            viewModel.callback = callback;

            courseTitleStep.caption(localizationManager.localize('createYourCourse'));
            viewModel.eventCategory = undefined;

            dialog.show([courseTemplateStep, courseTitleStep], constants.dialogs.createCourse.settings);

            courseTemplateStep.on(constants.dialogs.stepSubmitted, courseTemplateStepSubmitted);
            courseTitleStep.on(constants.dialogs.stepSubmitted, courseTitleStepSubmitted);
            dialog.on(constants.dialogs.dialogClosed, closed);
        }

        function closed() {
            courseTemplateStep.off(constants.dialogs.stepSubmitted, courseTemplateStepSubmitted);
            courseTitleStep.off(constants.dialogs.stepSubmitted, courseTitleStepSubmitted);
            dialog.off(constants.dialogs.dialogClosed, closed);
        }

        function courseTemplateStepSubmitted() {
            eventTracker.publish(events.chooseTemplateAndProceed, viewModel.eventCategory);
            dialog.navigateToNextStep();
        }

        function courseTitleStepSubmitted() {
            eventTracker.publish(events.defineCourseTitleAndProceed, viewModel.eventCategory);
            courseTitleStep.isProcessing(true);
            return createCourseCommand.execute(courseTitleStep.title(), courseTemplateStep.getSelectedTemplateId()).then(function (course) {
                dialog.close();
                
                if (_.isFunction(viewModel.callback)) {
                    viewModel.callback(course);
                }
                
                courseTitleStep.isProcessing(false);
            }).catch(function () {
                courseTitleStep.isProcessing(false);
            });
        }
    });