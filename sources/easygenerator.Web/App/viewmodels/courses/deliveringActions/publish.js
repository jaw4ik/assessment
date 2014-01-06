define(['constants'], function (constants) {
    var viewModel = {
        state: ko.observable()
    };

    viewModel.isDelivering = ko.computed(function () {
        return this.state() === constants.deliveringStates.building || this.state() === constants.deliveringStates.publishing;
    }, viewModel);

    return viewModel;
});