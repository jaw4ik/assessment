define(['durandal/app', 'plugins/router', 'treeOfContent/treeOfContent'], function (app, router, treeOfContent) {
    "use strict";

    var viewModel = {
        enabled: ko.observable(false),
        visible: ko.observable(false),

        goBackAction: null,
        goBackLink: null,
        goBackTooltip: null,

        enable: function (tooltip, url, action, alwaysVisible) {
            this.goBackTooltip = tooltip;
            this.goBackLink = '#' + url;
            this.goBackAction = function () {
                if (_.isFunction(action)) {
                    action();
                }
                router.navigateWithQueryString(url);
            };

            this.visible(alwaysVisible || !treeOfContent.isExpanded());
            this.enabled(true);
        }
    };

    app.on('treeOfContent:expanded', function() {
        viewModel.visible(false);
    });

    app.on('treeOfContent:collapsed', function () {
        viewModel.visible(true);
    });

    router.on('router:route:activating').then(function () {
        viewModel.enabled(false);
    });

    return viewModel;

});