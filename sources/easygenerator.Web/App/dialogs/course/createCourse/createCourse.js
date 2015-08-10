define(['constants', 'dialogs/course/createCourse/steps/courseTitleStep', 'dialogs/course/createCourse/steps/courseTemplateStep', 'widgets/dialogWizard/dialogWizard'],
    function (constants, courseTitleStep, courseTemplateStep, dialog) {
        var viewModel = {
            show: show,
            closed: closed
        };

        return viewModel;

        function show() {
            dialog.show([courseTemplateStep, courseTitleStep], constants.dialogs.createCourse.settings);
            courseTemplateStep.on(constants.dialogs.stepSubmitted, courseTemplateStepSubmitted);
            courseTitleStep.on(constants.dialogs.stepSubmitted, courseTitleStepSubmitted);
        }

        function closed() {
            courseTemplateStep.off(constants.dialogs.stepSubmitted, courseTemplateStepSubmitted);
            courseTitleStep.off(constants.dialogs.stepSubmitted, courseTitleStepSubmitted);
        }

        function courseTemplateStepSubmitted() {
            dialog.navigateToNextStep();
        }

        function courseTitleStepSubmitted() {
            var templateId = courseTemplateStep.getSelectedTemplateId();
            console.log(templateId);

            dialog.close();
        }
    });