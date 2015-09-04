define(['audio/UploadAudioModel'], function (UploadAudioModel) {
    return {
        create: create
    }

    function create(file) {
        return new UploadAudioModel(file);
    }
});