﻿define(['constants', 'plugins/router', 'eventTracker', 'localization/localizationManager'], function (constants, router, eventTracker, localizationManager) {

    "use strict";

    return function (key, firstname, amountOfDays, accessType, expirationDate) {
        this.key = key;
        this.firstname = firstname;
        this.amountOfDays = amountOfDays;

        this.openUpgradePlanUrl = openUpgradePlanUrl;
        this.expirationMessage = getExpirationMessage(accessType, expirationDate, amountOfDays);
    };

    function getExpirationMessage(accessType, expirationDate, amountOfDays) {
        var planName = getPlanName(accessType);
        var remainingTime = getRemainingTime(expirationDate, amountOfDays);

        return localizationManager.localize("upgradeNotificationContent").replace("{0}", planName)
            .replace("{1}", remainingTime);
    }

    function getPlanName(accessType) {
        if (accessType === constants.accessType.starter) {
            return localizationManager.localize("upgradeStarterPlan");
        } else if (accessType === constants.accessType.plus) {
            return localizationManager.localize("upgradePlusPlan");
        }

        throw "Undefined access type";
    }

    function getRemainingTime(expirationDate, amountOfDays) {
        var isToday = expirationDate.toDateString() == (new Date()).toDateString();

        if (amountOfDays == 0 && isToday) {
            return localizationManager.localize("upgradeNotificationToday");
        } else if ((amountOfDays == 0 && !isToday) || amountOfDays == 1) {
            return localizationManager.localize("upgradeNotificationIn1day");
        } else if (amountOfDays > 1) {
            return localizationManager.localize("upgradeNotificationInSeveralDays").replace("{0}", amountOfDays);
        }

        throw "Undefined remaing time";
    }

    function openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.expirationNotification);
        router.openUrl(constants.upgradeUrl);
    }

});