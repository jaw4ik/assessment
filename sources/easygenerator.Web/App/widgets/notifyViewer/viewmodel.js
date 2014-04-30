define(function () {

    "use strict";

    var
        noticelifeTime = 7000,
        noticefadeOutLifetime = 2000,
        notifyViewer = function () { },
        nodeTypeContent = 1;

    notifyViewer.notifications = ko.observableArray([]);
    notifyViewer.enabled = ko.observable(true);

    notifyViewer.prototype.activate = function () {
        notifyViewer.prototype.notifications = notifyViewer.notifications;
        notifyViewer.prototype.enabled = notifyViewer.enabled;
    };

    notifyViewer.prototype.closeNotice = function (notice) {
        notifyViewer.prototype.notifications.remove(notice);
    };

    notifyViewer.prototype.addNotice = function (notice) {
        if (notice.nodeType !== nodeTypeContent) {
            return;
        }

        $(notice).hide();
        notifyViewer.queue.push(notifyViewer.showItem, notice);
    };

    notifyViewer.queue = {
        promise: Q(),
        push: function (callback, args) {
            return this.promise = this.promise.then(function () {
                return callback(args);
            });
        }
    };

    notifyViewer.showItem = function (item) {
        var defer = Q.defer();

        $(item).fadeIn(defer.resolve);

        setTimeout(function () {
            $(item).fadeOut(noticefadeOutLifetime, function () {
                $(item).remove();
            });
        }, noticelifeTime, item);

        return defer.promise;
    };
    
    return notifyViewer;

});