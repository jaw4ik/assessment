define(['durandal/app', 'constants'], function (app, constants) {

    "use strict";

    var
        noticelifeTime = 7000,
        noticefadeOutLifetime = 2000,
        nodeTypeContent = 1;

    var notifyViewer = {
        notifications: ko.observableArray([]),
        enabled: ko.observable(true),
        moved: ko.observable(false),

        addNotice: addNotice
    };

    app.on(constants.messages.sidePanel.expanded, function() {
        notifyViewer.moved(true);
    });
    app.on(constants.messages.sidePanel.collapsed, function () {
        notifyViewer.moved(false);
    });

    return notifyViewer;

    function addNotice(notice) {
        if (notice.nodeType !== nodeTypeContent) {
            return;
        }
        $(notice).hide()
                 .fadeIn()
                 .delay(noticelifeTime)
                 .fadeOut(noticefadeOutLifetime, function () {
                     $(this).remove();
                 });
           
    }

});