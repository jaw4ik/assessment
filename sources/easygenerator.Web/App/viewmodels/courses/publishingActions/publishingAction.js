define([], function () {

    var ctor = function (courseId, action) {

        var viewModel = {
            state: ko.observable(action.state),
            packageUrl: ko.observable(action.packageUrl),
            isPublishing: ko.observable(false),
            isActive: ko.observable(false),
            courseId: courseId
        };

        viewModel.packageExists = ko.computed(function () {
            return !_.isNullOrUndefined(this.packageUrl()) && !_.isEmptyOrWhitespace(this.packageUrl());
        }, viewModel);

        return viewModel;
    };

    return ctor;
});