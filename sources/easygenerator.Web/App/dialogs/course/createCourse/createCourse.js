﻿define(['constants', 'dialogs/course/createCourse/steps/courseTitleStep', 'dialogs/course/createCourse/steps/courseTemplateStep', 'widgets/dialogWizard/viewmodel',
    'commands/createCourseCommand', 'plugins/router', 'eventTracker', 'clientContext'],
    function (constants, courseTitleStep, courseTemplateStep, dialog, createCourseCommand, router, eventTracker, clientContext) {
        "use strict";

        var events = {
            chooseTemplateAndProceed: 'Choose template and proceed',
            defineCourseTitleAndProceed: 'Define course title and proceed'
        };

        var viewModel = {
            show: show,
            closed: closed,
            courseTemplateStepSubmitted: courseTemplateStepSubmitted,
            courseTitleStepSubmitted: courseTitleStepSubmitted,
            eventCategory: undefined
        };

        return viewModel;

        function show() {
            if (_.isNullOrUndefined(clientContext.get(constants.clientContextKeys.showCreateCoursePopup))) {
                courseTitleStep.caption('Create your course');
                viewModel.eventCategory = undefined;
            } else {
                courseTitleStep.caption('Create your first course');
                viewModel.eventCategory = 'Splash pop-up after signup';
                clientContext.remove(constants.clientContextKeys.showCreateCoursePopup);
            }

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

                router.navigate('courses/' + course.id);
            }).fin(function () {
                courseTitleStep.isProcessing(false);
            });
        }
    });