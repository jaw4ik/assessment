define(['constants'], function (constants) {

    return function AudioViewModel(entity) {
        var that = this;

        that.id = entity.id;
        that.title = entity.title;
        that.vimeoId = ko.observable(entity.vimeoId);
        that.progress = ko.observable(entity.progress || 0);
        that.status = ko.observable(entity.status || constants.storage.audio.statuses.loaded);
        that.isDeleteConfirmationShown = ko.observable(false);

        var duration = ko.observable(entity.duration);

        that.duration = ko.computed({
            read: function () {
                var d = duration();
                if (d) {
                    var minutes = Math.floor(d / 60);
                    var seconds = d - (minutes * 60);

                    if (minutes < 10) { minutes = "0" + minutes; }
                    if (seconds < 10) { seconds = "0" + seconds; }

                    return minutes + ':' + seconds;
                }
                return '--:--';
            },
            write: function (value) {
                duration(value);
            }
        });

        that.off = function () {
            if (entity.off) {
                entity.off();
            }
        };

        if (entity.on) {
            entity.on(constants.storage.audio.statuses.inProgress).then(function (progress) {
                that.status(constants.storage.audio.statuses.inProgress);
                that.progress(progress || 0);
            });
            entity.on(constants.storage.audio.statuses.loaded).then(function (entity) {
                that.id = entity.id;
                that.status(constants.storage.audio.statuses.loaded);
                that.vimeoId(entity.vimeoId);
                that.duration(entity.duration);
            });
            entity.on(constants.storage.audio.statuses.failed).then(function (reason) {
                that.status(constants.storage.audio.statuses.failed);
            });
        }
    };

})