define(['eventTracker', 'localization/localizationManager', 'repositories/courseRepository', 'viewmodels/common/contentField'], function (eventTracker, localizationManager, repository, vmContentField) {
    "use strict";

    var eventsForCourseContent = {
        addContent: 'Define introduction',
        beginEditText: 'Start editing introduction',
        endEditText: 'End editing introduction'
    };

    var viewModel = {
        id: '',
        createdBy: '',
        activate: activate,
        eventTracker: eventTracker,
        localizationManager: localizationManager
    };

    return viewModel;

    function activate(courseId) {
        return repository.getById(courseId).then(function (course) {
            viewModel.id = course.id;
            viewModel.createdBy = course.createdBy;

            viewModel.courseIntroductionContent = vmContentField(course.introductionContent, eventsForCourseContent, false, function (content) {
                return repository.updateIntroductionContent(course.id, content);
            });

        });
    }

});