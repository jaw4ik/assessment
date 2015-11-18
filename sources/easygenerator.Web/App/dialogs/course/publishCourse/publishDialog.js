define(['userContext', 'dialogs/course/publishCourse/defaultPublish', 'dialogs/course/publishCourse/customPublish'], function (userContext, defaultPublishModel, customPublishModel) {
    "use strict";

    var viewModel = {
        courseId: '',
        publishModel: null,
        isShown: ko.observable(false),
        show: show,
        hide: hide,
        activate: activate
    };

    return viewModel;

    function show() {
        viewModel.isShown(true);
    }

    function hide() {
        viewModel.isShown(false);
    }

    function activate(courseId) {
        viewModel.courseId = courseId;
        var showCustomPublish = !!userContext.identity.company;
        viewModel.publishModel = showCustomPublish ? customPublishModel : defaultPublishModel;
    }
});