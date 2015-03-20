define(['plugins/router', 'plugins/dialog', 'eventTracker'], function (router, dialog, eventTracker) {
    'use strict';

    var events = {
        showDialog: 'Open move/copy question dialog',
        switchToMove: 'Switch to "move" item',
        switchToCopy: 'Switch to "copy" item',
        moveItem: 'Move item',
        copyItem: 'Copy item'
    };

    var moveCopyQuestionDialog = {
        isShown: ko.observable(false),
        show: show,
        hide: hide
    };

    return moveCopyQuestionDialog;

    function show() {
        eventTracker.publish(events.showDialog);
        moveCopyQuestionDialog.isShown(true);
    }

    function hide() {
        moveCopyQuestionDialog.isShown(false);
    }

});