define(['constants', 'dialogs/course/createCourse/steps/courseTitleStep', 'dialogs/course/createCourse/steps/courseTemplateStep', 'widgets/dialogWizard/viewmodel',
    'repositories/templateRepository', 'commands/createCourseCommand', 'plugins/router'],
    function (constants, courseTitleStep, courseTemplateStep, dialog, templateRepository, createCourseCommand, router) {
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
                dialog.on(constants.dialogs.dialogClosed, closed);
            });
        }

        function closed() {
            courseTemplateStep.off(constants.dialogs.stepSubmitted, courseTemplateStepSubmitted);
            courseTitleStep.off(constants.dialogs.stepSubmitted, courseTitleStepSubmitted);
            dialog.off(constants.dialogs.dialogClosed, closed);
        }

        function courseTemplateStepSubmitted() {
            viewModel.courseTemplateId(courseTemplateStep.getSelectedTemplateId());
            dialog.navigateToNextStep();
        }

        function courseTitleStepSubmitted() {
            courseTitleStep.isProcessing(true);
            createCourseCommand.execute(courseTitleStep.title(), courseTemplateStep.getSelectedTemplateId()).then(function (course) {
                dialog.close();

                router.navigate('courses/' + course.id);
            }).fin(function () {
                courseTitleStep.isProcessing(false);
            });
        }
    });