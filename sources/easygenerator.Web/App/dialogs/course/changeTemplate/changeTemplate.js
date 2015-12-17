define(['constants', 'widgets/dialog/viewmodel', 'eventTracker', 'dialogs/course/common/templateSelector/templateSelector', 'durandal/app', 'repositories/courseRepository'],
    function (constants, dialog, eventTracker, TemplateSelector, app, courseRepository) {
        "use strict";

        var events = {
            openChangeTemplateDialog:'Open \'change template\' dialog',
            updateCourseTemplate: 'Change course template to'
        },

         viewModel = {
             templateId: ko.observable(),
             isProcessing: ko.observable(false),
             courseId: undefined,
             show: show,
             submit: submit,
             templateSelector: new TemplateSelector()
         };

        return viewModel;

        function show(courseId, templateId) {
            viewModel.courseId = courseId;
            viewModel.templateId(templateId);
            eventTracker.publish(events.openChangeTemplateDialog);
            dialog.show(viewModel, constants.dialogs.changeCourseTemplate.settings);
        }

        function submit() {
            var template = viewModel.templateSelector.selectedTemplate();
            eventTracker.publish(events.updateCourseTemplate + ' \'' + (template.isCustom ? 'custom' : template.name) + '\'');
            if (template.id === viewModel.templateId()) {
                return Q.fcall(function () {
                    dialog.close();
                });
            }

            viewModel.isProcessing(true);
            return courseRepository.updateCourseTemplate(viewModel.courseId, template.id).then(function (courseTemplate) {
                app.trigger(constants.messages.course.templateUpdated + viewModel.courseId, courseTemplate);
            }).fin(function () {
                viewModel.isProcessing(false);
                dialog.close();
            });
        }
    });