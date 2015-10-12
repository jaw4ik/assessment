define(['durandal/app', 'constants', 'eventTracker'], function (app, constants, eventTracker) {
    "use strict";

    var viewModel = {
        isExpanded: ko.observable(true),
        isVisible: ko.observable(true),

        expand: expand,
        collapse: collapse,
        onCollapsed: onCollapsed,

        activate: activate
    };

    return viewModel;

    function expand() {
        eventTracker.publish('Expand navigation bar');
        viewModel.isExpanded(true);
        _.defer(function () { viewModel.isVisible(true); });
        app.trigger(constants.messages.treeOfContent.expanded);
    }

    function collapse() {
        eventTracker.publish('Collapse navigation bar');
        viewModel.isExpanded(false);
        app.trigger(constants.messages.treeOfContent.collapsed);
    }

    function onCollapsed() {
        viewModel.isVisible(false);
    }

    function activate() { }

});