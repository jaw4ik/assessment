(function(app) {
    var viewModel = {
        processing: ko.observable(true),
        sources: ko.observableArray([]),
        currentSource: ko.observable(null),
        currentQuality: ko.observable(null)
    }

    app.playerViewModel = viewModel;
})(window.app || {});