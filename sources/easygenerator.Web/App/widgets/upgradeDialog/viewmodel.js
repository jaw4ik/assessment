define(['eventTracker', 'plugins/router', 'constants', 'localization/localizationManager'],
    function (eventTracker, router, constants, localizationManager) {
        "use strict";

        var events = {
            upgradeNow: 'Upgrade now',
            skipUpgrade: 'Skip upgrade'
        };

        var viewmodel = {
            containerCss: ko.observable(''),
            title: ko.observable(''),
            subtitle: ko.observable(''),
            description: ko.observable(''),
            upgradeBtnText: ko.observable(''),
            skipBtnText: ko.observable(''),

            eventCategory: '',
            isShown: ko.observable(false),

            show: show,
            upgrade: upgrade,
            skip: skip
        };

        return viewmodel;

        function show(settings) {
            var defaults = constants.dialogs.upgrade.settings.default;
            var dialogSettings = _.isNullOrUndefined(settings) ? defaults : _.defaults(settings, defaults);

            update(dialogSettings);
            viewmodel.isShown(true);
        }

        function update(settings) {
            viewmodel.containerCss(settings.containerCss);

            viewmodel.title(getLocalizedValue(settings.titleKey));
            viewmodel.subtitle(getLocalizedValue(settings.subtitleKey));
            viewmodel.description(getLocalizedValue(settings.descriptionKey));
            viewmodel.upgradeBtnText(getLocalizedValue(settings.upgradeBtnTextKey));
            viewmodel.skipBtnText(getLocalizedValue(settings.skipBtnTextKey));

            viewmodel.eventCategory = settings.eventCategory;
        }

        function getLocalizedValue(key) {
            return _.isEmptyOrWhitespace(key) ? '' : localizationManager.localize(key);
        }

        function upgrade() {
            eventTracker.publish(events.upgradeNow, viewmodel.eventCategory);
            router.openUrl(constants.upgradeUrl);
            viewmodel.isShown(false);
        }

        function skip() {
            eventTracker.publish(events.skipUpgrade, viewmodel.eventCategory);
            viewmodel.isShown(false);
        }
    });