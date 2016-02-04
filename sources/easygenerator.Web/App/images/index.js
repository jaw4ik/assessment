import * as getImages from './queries/getImages.js';
import imageUpload from 'imageUpload.js';
import * as deleteImage from './commands/deleteImage.js';
import Image from './image.js';
import notify from 'notify.js';
import preview from './preview/index.js';
import eventTracker from 'eventTracker';

let eventCategory = 'Image library',
    events = {
        openChooseImageDialog: 'Open \'choose image file\' dialog',
        uploadImageFile: 'Upload image file',
        deleteImage: 'Delete image from library'
    }

class Images{
    constructor() {
        this.images = ko.observableArray([]);
    }
        
    activate() {
        this.images([]);

        let that = this;

        return getImages.execute().then(images => {
            _.each(images, function (image) {
                that.images.push(new Image(image));
            });
            preview.images = that.images;
        }).catch(reason => {
            notify.error(reason);
        });
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
        let that = this;

        _.each(arguments, file => {
            that.uploadImage(file);
        });
    }

    uploadImage(file) {
        eventTracker.publish(events.uploadImageFile, eventCategory);
        let that = this;

        return imageUpload.v2(file).then(image => {
            that.images.unshift(new Image(image));
        }).catch(reason => {
            notify.error(reason);
        });
    }

    deleteImage(image) {
        eventTracker.publish(events.deleteImage, eventCategory);
        let that = this;

        image.isDeleting(true);

        return deleteImage.execute(image.id).then(() => {
            that.images.remove(image);
        }).catch(reason => {
            image.isDeleting(false);
            notify.error(reason);
        });;
    }

    openChooseImageDialogHandler() {
        eventTracker.publish(events.openChooseImageDialog, eventCategory);
    }
}

export default new Images();