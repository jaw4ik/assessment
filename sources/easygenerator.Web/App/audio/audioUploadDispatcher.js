import app from 'durandal/app';
import factory from 'audio/factory';
import constants from 'constants';
import _ from 'underscore';

class Dispatcher {
    constructor() {
        this.uploads = [];

        app.on(constants.storage.audio.statuses.failed).then(entity => {
            this.removeUpload(entity);
        });

        app.on(constants.storage.audio.statuses.loaded).then(entity => {
            this.removeUpload(entity);
        });
    }

    removeUpload(entity){
        this.uploads = _.without(this.uploads, entity);
    }

    startUploading(file) {
        let model = factory.create(file);
        this.uploads.unshift(model);
        model.upload();
        return model;
    }
}

let dispatcher = new Dispatcher();
export default dispatcher;