define(['widgets/notifyViewer/viewmodel', 'localization/localizationManager'], function (notifyViewer, localizationManager) {
    "use strict";

    var
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

           notifyViewer.notifications.remove(function (item) {
                return item.text == message && item.type == type;
           });

           notifyViewer.notifications.push(notificationItem);
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