import factory from 'audio/factory';
import constants from 'constants';
import _ from 'underscore';

let dispatcher = {
        uploads: [],
        startUploading: startUploading
    };

function startUploading(file) {
    const model = factory.create(file);
    dispatcher.uploads.unshift(model);

    model.on(constants.storage.audio.statuses.failed).then(() => {
        dispatcher.uploads = _.without(dispatcher.uploads, model);
    });

    model.on(constants.storage.audio.statuses.loaded).then(() => {
        dispatcher.uploads = _.without(dispatcher.uploads, model);
    });

    model.upload();
    return model;
}

export default dispatcher;
export var __useDefault = true;