define(['durandal/events', 'models/Audio', 'viewmodels/audios/commands/convert', 'viewmodels/audios/commands/pull', 'dataContext'], function (Events, Audio, convert, pull, dataContext) {

    return function (file) {
        var that = this;

        Events.includeIn(that);

        that.name = file.name.replace(/\.[^/.]+$/, '');
        that.title = file.name.replace(/\.[^/.]+$/, '');
        that.size = file.size;
        that.progress = 0;

        that.status = 'not started';
        that.error = null;

        function setStatus(title, data) {
            that.status = title;
            that.trigger(title, data);
        }

        that.upload = function () {
            setStatus('started');

            return convert.execute(file)
                .then(function (result) {
                    return pull.execute({ title: that.name, size: that.size, duration: result.duration, url: result.url })
                        .then(function (entity) {
                            var audio = new Audio({
                                id: entity.Id,
                                createdOn: entity.CreatedOn,
                                modifiedOn: entity.CreatedOn,
                                title: that.name,
                                duration: result.duration,
                                vimeoId: entity.VimeoId
                            });
                            dataContext.audios.push(audio);
                            return audio;
                        });
                }).then(function (data) {
                    setStatus('success', data);
                }, function (reason) {
                    setStatus('error', reason);
                    throw reason;
                }, function (progress) {
                    that.progress = progress;
                    that.trigger('progress', progress);
                });
        }
    }

})