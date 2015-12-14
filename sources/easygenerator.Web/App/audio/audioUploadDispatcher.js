import factory from 'audio/factory';
import constants from 'constants';
import _ from 'underscore';

class Dispatcher{
    constructor() {
        this.uploads = [];
    }

    startUploading(file) {
        let model = factory.create(file);
        this.uploads.unshift(model);
        let that = this;

        model.on(constants.storage.audio.statuses.failed).then(() => {
            that.uploads = _.without(that.uploads, model);
        });

        model.on(constants.storage.audio.statuses.loaded).then(() => {
            that.uploads = _.without(that.uploads, model);
        });

        model.upload();
        return model;
    }
}

let dispatcher = new Dispatcher();
export default dispatcher;