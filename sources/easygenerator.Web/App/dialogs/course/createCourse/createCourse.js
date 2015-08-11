define(['constants', 'dialogs/course/createCourse/steps/courseTitleStep', 'dialogs/course/createCourse/steps/courseTemplateStep', 'widgets/dialogWizard/dialogWizard', 'repositories/templateRepository'],
    function (constants, courseTitleStep, courseTemplateStep, dialog, templateRepository) {
        var viewModel = {
            show: show,
            closed: closed,
            courseTemplateId: ko.observable(''),
            courseTitle: ko.observable('')
        };

        return viewModel;

        function show() {

            return templateRepository.getDefaultTemplate().then(function (defaultTemplate) {
                viewModel.courseTemplateId(defaultTemplate.id);

                dialog.show([
             { model: courseTemplateStep, data: viewModel.courseTemplateId },
             { model: courseTitleStep, data: viewModel.courseTitle }],
             constants.dialogs.createCourse.settings);

                courseTemplateStep.on(constants.dialogs.stepSubmitted, courseTemplateStepSubmitted);
                courseTitleStep.on(constants.dialogs.stepSubmitted, courseTitleStepSubmitted);
            });

        }

        function closed() {
            courseTemplateStep.off(constants.dialogs.stepSubmitted, courseTemplateStepSubmitted);
            courseTitleStep.off(constants.dialogs.stepSubmitted, courseTitleStepSubmitted);
        }

        function courseTemplateStepSubmitted() {
            console.log('step submitted');
            viewModel.courseTemplateId(courseTemplateStep.getSelectedTemplateId());
            dialog.navigateToNextStep();
        }

        function courseTitleStepSubmitted() {
            dialog.close();
        }
    });