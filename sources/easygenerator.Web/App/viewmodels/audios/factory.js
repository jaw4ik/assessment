define(['viewmodels/audios/UploadAudioModel'], function (UploadAudioModel) {
    return {
        create: create
    }

    function create(file) {
        return new UploadAudioModel(file);
    }
});