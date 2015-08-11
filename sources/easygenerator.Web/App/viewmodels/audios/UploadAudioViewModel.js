define(['constants', 'viewmodels/audios/AudioViewModel'], function (constants, AudioViewModel) {
    return function UploadAudioViewModel(model) {
        var that = this;


        AudioViewModel.apply(that, [
            {
                id: undefined,
                title: model.name,
                vimeoId: undefined,
                progress: model.progress,
                status: constants.storage.audio.statuses.inProgress,
                duration: undefined
            }
        ]);

        model.on('progress').then(function (progress) {
            that.progress(progress);
        });

        model.on('error').then(function (reason) {
            that.status(constants.storage.audio.statuses.failed);
            console.error(reason);
        });

        model.on('success').then(function (entity) {
            that.id = entity.id;
            that.vimeoId(entity.vimeoId);            
            that.duration(entity.duration);
            that.status(constants.storage.audio.statuses.loaded);
        });
    };
})