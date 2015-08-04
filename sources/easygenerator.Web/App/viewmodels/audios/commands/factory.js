define(['viewmodels/audios/commands/model'], function (UploadModel) {
    return {
        collection: [],

        create: create
    }

    function create(file) {
        return new UploadModel(file);
    }
});