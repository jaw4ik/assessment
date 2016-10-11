import * as getImages from './queries/getImages.js';
import * as deleteImage from './commands/deleteImage.js';
import imageUpload from 'imageUpload.js';
import Image from './image.js';
import notify from 'notify.js';
import preview from './preview/index.js';
import eventTracker from 'eventTracker';
import ko from 'knockout';
import _ from 'underscore';

const eventCategory = 'Image library';
const events = {
    openChooseImageDialog: 'Open \'choose image file\' dialog',
    uploadImageFile: 'Upload image file',
    deleteImage: 'Delete image from library'
};

export default class ImageLibrary {
    constructor() {
        this.images = ko.observableArray([]);
    }

    async activate() {
        this.images.removeAll();

        try {
            let images = await getImages.execute();
            _.each(images, image => this.images.push(new Image(image)));
            preview.images = this.images;
        } catch (e) {
            notify.error(e);
        }
    }
   
    showDeleteImageConfirmation(image) {
        image.isDeleteConfirmationShown(true);
    }

    hideDeleteImageConfirmation(image) {
        image.isDeleteConfirmationShown(false);
    }

    showImagePopup(image) {
        let index = this.images().indexOf(image);
        preview.show(index);
    }
  
    uploadImages() {
        _.each(arguments, file => this.uploadImage(file));
    }

    async uploadImage(file) {
        eventTracker.publish(events.uploadImageFile, eventCategory);

        try {
            let image = await imageUpload.v2(file);
            this.images.unshift(new Image(image));
        } catch (e) {
            notify.error(e);
        }
    }

    async deleteImage(image) {
        eventTracker.publish(events.deleteImage, eventCategory);

        image.isDeleting(true);

        try {
            await deleteImage.execute(image.id);
            this.images.remove(image);
        } catch (e) {
            image.isDeleting(false);
            notify.error(e);
        }
    }

    openChooseImageDialogHandler() {
        eventTracker.publish(events.openChooseImageDialog, eventCategory);
    }
}