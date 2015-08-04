define(['constants','viewmodels/audios/AudioViewModel'], function (constants, AudioViewModel) {
    return function UploadAudioViewModel(model) {
        var that = this;

        AudioViewModel.apply(this, [
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

        model.on('error').then(function () {
            that.status(constants.storage.audio.statuses.failed);
        });

        model.on('success').then(function () {
            that.status(constants.storage.audio.statuses.loaded);
        });
    };
})