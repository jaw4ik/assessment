define(['userContext'], function (userContext) {
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
        var hideDefaultPublishOptions = userContext.identity.company && userContext.identity.company.hideDefaultPublishOptions;
        viewModel.publishModel = hideDefaultPublishOptions ? 'dialogs/course/publishCourse/customPublish' : 'dialogs/course/publishCourse/defaultPublish';
    }
});