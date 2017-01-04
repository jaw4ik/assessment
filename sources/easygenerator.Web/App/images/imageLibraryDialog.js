import ImageLibrary from './imageLibrary';
import dialog from 'widgets/dialog/viewmodel';
import constants from 'constants';
import _ from 'underscore';
import ko from 'knockout';

class ImageLibraryDialog extends ImageLibrary {
    constructor() {
        super();

        this.selectedImageId = ko.observable(null);

        this.selectImage = this.selectImage.bind(this);
        this.selectImageAndCloseDialog = this.selectImageAndCloseDialog.bind(this);
        this.done = this.done.bind(this);
    }

    activate() {
        super.activate();

        this.selectedImageId(null);
    }

    chooseImage(callback) {
        dialog.show(this, constants.dialogs.mediaLibraryDialog.settings);
        this.callback = callback;
    }

    selectImage(image) {
        this.selectedImageId(image.id);
    }

    selectImageAndCloseDialog(image) {
        this.callback(image.url);
        dialog.close();
    }

    done() {
        let selectedImage = _.find(this.images(), image => image.id === this.selectedImageId());
        this.callback(selectedImage ? selectedImage.url : null);
        dialog.close();
    }
}

export default new ImageLibraryDialog();