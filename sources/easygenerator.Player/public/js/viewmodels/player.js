(function(app) {
    var viewModel = {
        processing: ko.observable(true),
        sources: ko.observableArray([]),
        currentSource: ko.observable(null),
        currentQuality: ko.observable(null),
        isIos: /iPad|iPhone|iPod/.test(navigator.platform)
    }

    app.playerViewModel = viewModel;
})(window.app || {});