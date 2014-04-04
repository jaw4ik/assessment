define(['models/backButton', 'durandal/app', 'constants', 'plugins/router', 'localization/localizationManager'],
    function (BackButton, app, constants, router, localizationManager) {
        "use strict";

        var backButton = function () {

            this.enabled = ko.observable(false);
            this.visible = ko.observable(false);

            this.treeExpanded = true;

            this.url = ko.observable(null);
            this.tooltip = ko.observable(null);
            this.action = null;

            this.activate = function () {
                this.update(router.activeItem());
                router.on('router:navigation:complete', this.update);

                app.on(constants.messages.treeOfContent.expanded, this.hide);
                app.on(constants.messages.treeOfContent.collapsed, this.show);
            };

            var that = this;

            this.show = function () {
                that.visible(true);
                that.treeExpanded = !that.visible();
            };

            this.hide = function () {
                that.visible(false);
                that.treeExpanded = !that.visible();
            };

            this.update = function (viewmodel) {

                var backButtonData = viewmodel.backButtonData;
                if (!(backButtonData instanceof BackButton)) {
                    that.enabled(false);
                    return;
                }

                that.url('#' + backButtonData.url);
                that.tooltip(localizationManager.localize('backTo') + ' ' + backButtonData.backViewName);
                that.action = function () {
                    if (_.isFunction(backButtonData.callback)) {
                        backButtonData.callback();
                    }

                    router.navigateWithQueryString(backButtonData.url);
                };

                that.visible(backButtonData.alwaysVisible || !that.treeExpanded);
                that.enabled(true);
            };

        };

        return backButton;

    });