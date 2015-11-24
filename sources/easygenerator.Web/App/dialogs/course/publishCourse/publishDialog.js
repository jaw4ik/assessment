define(['userContext', 'dialogs/course/publishCourse/defaultPublish', 'dialogs/course/publishCourse/customPublish'], function (userContext, defaultPublishModel, customPublishModel) {
    "use strict";

    var viewModel = {
        publishModel: null,
        isShown: ko.observable(false),
        show: show,
        hide: hide,
        activate: activate
    };

    return viewModel;

    function show(courseId) {
        viewModel.publishModel.activate(courseId);
        viewModel.isShown(true);
    }

    function hide() {
        viewModel.publishModel.deactivate();
        viewModel.isShown(false);
    }

    function activate() {
        var showCustomPublish = !!userContext.identity.company;
        viewModel.publishModel = showCustomPublish ? customPublishModel : defaultPublishModel;
    }
});