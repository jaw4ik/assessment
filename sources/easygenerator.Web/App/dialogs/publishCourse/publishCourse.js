define(['plugins/router', 'viewmodels/courses/publishingActions/publish', 'repositories/courseRepository', 'constants'], function (router, publishAction, repository, constants) {

    "use strict";

    var viewModel = {
        isShown: ko.observable(false),
        publishAction: ko.observable(),
        states: constants.publishingStates,
        show: show,
        hide: hide
    };

    return viewModel;

    function show(courseId) {
        return repository.getById(courseId).then(function (course) {
            viewModel.publishAction(publishAction(course, constants.eventCategories.header));
            viewModel.isShown(true);
        });
    }

    function hide() {
        viewModel.isShown(false);
    }
});