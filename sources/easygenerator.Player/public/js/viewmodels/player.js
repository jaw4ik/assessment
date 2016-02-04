(function(app) {
    var viewModel = {
        statuses: {
            loading: 'loading',
            processing: 'processing',
            available: 'available',
            notFound: 'not-found'
        },
        
        status: ko.observable(null),
        sources: ko.observableArray([]),
        currentSource: ko.observable(null),
        currentQuality: ko.observable(null),
        ios: /iPad|iPhone|iPod/.test(navigator.platform)
    }

    app.playerViewModel = viewModel;
})(window.app || {});