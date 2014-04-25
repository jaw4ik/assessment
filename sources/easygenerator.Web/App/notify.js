define(['widgets/notifyViewer/viewmodel', 'localization/localizationManager'], function (notifyViewer, localizationManager) {
    "use strict";

    var
        lifeTime = 5000,

        noticeTypes = {
            info: "info",
            error: "error",
            success: "success"
        },

        success = function (message) {
            showNotification(message, noticeTypes.success);
        },

        info = function (message) {
            showNotification(message, noticeTypes.info);
        },

        error = function (message) {
            showNotification(message, noticeTypes.error);
        },

        saved = function () {
            var message = localizationManager.localize('allChangesAreSaved');
            showNotification(message, noticeTypes.success);
        },

        showNotification = function (message, type) {
            var notificationItem = {
                text: message,
                type: type
            };

            notifyViewer.notifications.push(notificationItem);
            setTimeout(function (array, item) { array.remove(item); }, lifeTime, notifyViewer.notifications, notificationItem);
        },

        hide = function () {
            notifyViewer.notifications.removeAll();
        };

    return {
        success: success,
        info: info,
        error: error,
        saved: saved,

        hide: hide
    };

});