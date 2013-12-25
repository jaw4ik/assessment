define(['widgets/notifyViewer/viewmodel', 'localization/localizationManager'], function (notifyViewer, localizationManager) {

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
            notifyViewer.notifications.removeAll();
            notifyViewer.notifications.push({
                text: message,
                type: type
            });
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