define(['durandal/events', 'fileUpload'], function (Events, service) {

    function UploadModel(file) {
        var that = this;
        Events.includeIn(that);


        that.name = file.name.replace(/\.[^/.]+$/, '');
        that.progress = 0;

        that.error = null;

        that.status = 'not started';




        that.start = function () {
            apply('started');
            service.xhr2(file, '//localhost:1337/conversion')
                .then(function (convertedFile) {
                    //storageHttpWrapper.post(constants.storage.host + '/api/media/audio/upload', { title: audio.title, url: convertedFile[0].url, size: file.size }).then(function(vimeoId) {
                    //    dfd.resolve(vimeoId);
                    //});

                    //that.trigger('success');
                    //that.trigger('end');
                    return 'ok';
                }, function (reason) {

                    throw reason;
                }, function (progress) {
                    that.progress = progress;
                    that.trigger('progress', progress);
                }).then(function () {
                    apply('success');
                    that.trigger('end');
                }).catch(function () {
                    apply(error);
                    that.trigger('end');
                });
        }


        function apply(status, data) {
            that.status = status;
            that.trigger(status, data);
        }
    }

    return UploadModel;

})