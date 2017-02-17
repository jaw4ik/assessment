import * as getImages from './queries/getImages';
import * as deleteImage from './commands/deleteImage';
import uploadImage from './commands/upload';
import Image from './image.js';
import notify from 'notify.js';
import preview from './preview/index.js';
import eventTracker from 'eventTracker';
import ko from 'knockout';
import _ from 'underscore';
import system from 'durandal/system';

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
            this.images(_.map(images, image => new Image(image)));
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

        var defaultImage = this._generateDefaultImage();
        this.images.unshift(defaultImage);

        try {
            let optionalData = {
                prepareResizedImages: [
                    {
                        width: 200,
                        height: 113,
                        scaleBySmallerSide: true,
                        required: true
                    }
                ]
            };
            let image = await uploadImage.execute(file, optionalData);
            this.images.remove(defaultImage);
            this.images.unshift(new Image(image));
        } catch (e) {
            this.images.remove(defaultImage);
            notify.error(e);
        }
    }

    _generateDefaultImage() {
        return new Image({
            id: system.guid(),
            title: '',
            url: '',
            isDirty: true
        });
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