define(['constants', 'dialogs/course/createCourse/steps/courseTitleStep', 'dialogs/course/createCourse/steps/courseTemplateStep', 'widgets/dialogWizard/viewmodel',
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
            courseTitleStepSubmitted: courseTitleStepSubmitted
        };

        return viewModel;

        function show() {
            dialog.show([courseTemplateStep, courseTitleStep], constants.dialogs.createCourse.settings);

            courseTemplateStep.on(constants.dialogs.stepSubmitted, courseTemplateStepSubmitted);
            courseTitleStep.on(constants.dialogs.stepSubmitted, courseTitleStepSubmitted);
            dialog.on(constants.dialogs.dialogClosed, closed);
        }

        function closed() {
            clientContext.remove(constants.clientContextKeys.showCreateCoursePopup);

            courseTemplateStep.off(constants.dialogs.stepSubmitted, courseTemplateStepSubmitted);
            courseTitleStep.off(constants.dialogs.stepSubmitted, courseTitleStepSubmitted);
            dialog.off(constants.dialogs.dialogClosed, closed);
        }

        function courseTemplateStepSubmitted() {
            eventTracker.publish(events.chooseTemplateAndProceed);
            dialog.navigateToNextStep();
        }

        function courseTitleStepSubmitted() {
            eventTracker.publish(events.defineCourseTitleAndProceed);
            courseTitleStep.isProcessing(true);
            return createCourseCommand.execute(courseTitleStep.title(), courseTemplateStep.getSelectedTemplateId()).then(function (course) {
                dialog.close();

                router.navigate('courses/' + course.id);
            }).fin(function () {
                courseTitleStep.isProcessing(false);
            });
        }
    });