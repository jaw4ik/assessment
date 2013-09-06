define(['jquery'], function ($) {

    var
        targetSelector = "#content > *:first",
        containerSelector = "notification-container",

        notificationClass = "notification",
        notificationTextClass = "notification-text",
        notificationIconClass = "notification-icon",
        notificationCloseClass = "notification-close",

        infoClass = "info",
        successClass = "success",
        errorClass = "error"
    ;

    var
        info = function (message) {
            showMessage(message, infoClass);
        }
    ;

    function getContaner() {
        var cnt = $("." + containerSelector);
        if (cnt.length) {
            return cnt;
        } else {
            return $("<div />").addClass(containerSelector).appendTo(targetSelector);
        }
    }

    function showMessage(message, messageClass) {

        hideMessage();

        $("<div />")
            .addClass(notificationClass)
            .addClass(messageClass)
            .append($("<span />").addClass(notificationIconClass))
            .append($("<span />").addClass(notificationTextClass).text(message))
            .append($("<a />").addClass(notificationCloseClass).html("&times;").click(function () { $(this).closest("." + notificationClass).remove(); }))
            .appendTo(getContaner());

    }

    function hideMessage() {
        $("." + containerSelector).empty();
    }

    return {
        info: info
    };

});