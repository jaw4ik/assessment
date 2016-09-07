define(['durandal/app', 'durandal/events', 'constants', 'models/audio', 'audio/convertion/commands/convert', 'audio/vimeo/commands/pull', 'dataContext'], function (app, Events, constants, Audio, convert, pull, dataContext) {
    'use strict';

    return function (file) {
        var that = this;

        Events.includeIn(that);

        that.title = file.name.replace(/\.[^/.]+$/, '');
        that.size = file.size;
        that.progress = 0;

        that.status = constants.storage.audio.statuses.notStarted;
        that.error = null;

        function setStatus(title, data) {
            that.status = title;
            that.trigger(title, data);
        }

        function sendUploadStatus(title) {
            app.trigger(title, that);
        }

        that.upload = function () {
            setStatus(constants.storage.audio.statuses.inProgress);

            return convert.execute(file)
                .then(function (result) {
                    return pull.execute({ title: that.title, size: that.size, duration: result.duration, url: result.url })
                        .then(function (entity) {
                            var audio = new Audio({
                                id: entity.Id,
                                createdOn: entity.CreatedOn,
                                modifiedOn: entity.CreatedOn,
                                title: that.title,
                                duration: result.duration,
                                vimeoId: entity.VimeoId,
                                available: false,
                                source: result.url
                            });
                            dataContext.audios.push(audio);
                            return audio;
                        });
                }).then(function (data) {
                    setStatus(constants.storage.audio.statuses.loaded, data);
                    sendUploadStatus(constants.storage.audio.statuses.loaded);
                }, function (reason) {
                    setStatus(constants.storage.audio.statuses.failed, reason);
                    sendUploadStatus(constants.storage.audio.statuses.failed);
                    throw reason;
                }, function (progress) {
                    that.progress = progress;
                    that.trigger(constants.storage.audio.statuses.inProgress, progress);
                });
        }
    }

})