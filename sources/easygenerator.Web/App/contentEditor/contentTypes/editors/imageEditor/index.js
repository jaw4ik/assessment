import ko from 'knockout';
import imageLibraryDialog from 'images/imageLibraryDialog';
import binder from 'binder';
import constants from 'constants';
import ImageCropper from './components/ImageCropper';
import imageSourceHelper from './components/imageSourceHelper';
import imageUpload from 'imageUpload';
import './bindingHandlers/resizableBindingHandler';
import './bindingHandlers/toggleElementSizeBindingHandler';
import './bindingHandlers/slideEditButtonsBindingHandler';
import 'components/bindingHandlers/floatingToolbarBindingHandler';

export const className = 'ImageEditor';

export default class ImageEditor {
    constructor(data, callbacks, contentType) {
        binder.bindClass(this);
        this.viewUrl = 'contentEditor/contentTypes/editors/imageEditor/index.html';
        this.constants = constants;

        this.data = ko.observable(data);
        this.twoImagesMode = ko.observable(contentType === constants.contentsTypes.imageEditorTwoColumns);
        this.contentType = ko.observable(contentType);
        this.callbacks = callbacks;

        this.isReadyForEdit = ko.observable(false);
        this.isResizeMode = ko.observable(false);
        this.isEditMode = ko.observable(false);
        this.scale = ko.observable(1);
        
        this.currentImageUrl = ko.observable(imageSourceHelper.getSrc(data));
        this.isLoading = ko.observable(false);
        this.linkTooltipShowed = ko.observable(false);
        this.imageUrlFromLink = ko.observable('');
        this.isSizeChanged = ko.observable(false);
        this.canShowActionButtonTooltip = ko.observable(false);
        this.canShowChangeImageButtonTooltip = ko.observable(false);
    }
    activate() {
        let imageSrc = imageSourceHelper.getSrc(this.data());
        let initialOptions = imageSourceHelper.getInitialData(this.data());

        this.canShowActionButtonTooltip(false);
        this.canShowChangeImageButtonTooltip(false);

        this.isReadyForEdit(false);
        this.imageCropper = new ImageCropper();
        this.imageCropper.disable();
        this.imageCropper.setImage(imageSrc, initialOptions).then(() => this.isReadyForEdit(true));
    }
    async imageChanged(src) {
        let imageData = await this.imageCropper.getImageData();
        this.isReadyForEdit(false);
        await this.imageCropper.setImage(src);
        if (imageData) {
            this.imageCropper.setSize(imageData.w, imageData.h);
            this.imageCropper.reset();
        }
        this.isReadyForEdit(true);
        this.save();
    }
    scaleChanged(newValue) {
        if (!this.isResizeMode()) {
            return;
        }
        
        this.imageCropper.setScale(newValue);
    }
    sizeChanged(width, height) {
        this.imageCropper.setSize(width, height);
        this.isSizeChanged(true);
        
        if (this.twoImagesMode()) {
            this.callbacks.broadcastToOtherInstances(this, 'sizeChanged', { width, height });
        }
    }
    sizeChangedByAnotherInstance(width, height) {
        this.imageCropper.setSize(width, height);
    }
    resetImage() {
        this.imageCropper.reset();
        this.scale(1);
        this.scale.valueHasMutated();
    }
    async save() {
        let imageSource = await this.imageCropper.getSource();
        imageSource = imageSourceHelper.setInitialData(imageSource, await this.imageCropper.getImageData());
        this.data(imageSource);
        this.callbacks.save();
    }
    startEditMode() {
        if (this.isEditMode()) {
            return;
        }

        this.isEditMode(true);
        this.callbacks.startEditing();
    }
    stopEditMode() {
        if (!this.isEditMode() || this.isResizeMode()) {
            return;
        }

        this.isEditMode(false);
    }
    async startResizing() {
        if (this.isResizeMode()) {
            return;
        }

        if (!this.isEditMode()) {
            this.startEditMode();
        }

        this.scale(await this.imageCropper.getScale());
        this.isResizeMode(true);
        this.imageCropper.enable();
        this.callbacks.enableOverlay();
    }
    stopResizing() {
        if (!this.isResizeMode()) {
            return;
        }

        this.isResizeMode(false);
        this.imageCropper.disable();
        this.save();

        if (this.twoImagesMode()) {
            this.callbacks.broadcastToOtherInstances(this, 'resizingStopped');
        }

        this.callbacks.disableOverlay();
    }
    stopResizeAndEdit(){
        if (!this.isEditMode() && !this.isResizeMode()) {
            return;
        }
        this.isEditMode(false);
        this.isResizeMode(false);
        this.callbacks.disableOverlay();
    }
    toLeft() {
        this._changeType(constants.contentsTypes.imageInTheLeft);
    }
    toRight() {
        this._changeType(constants.contentsTypes.imageInTheRight);
    }
    toCenter() {
        this._changeType(constants.contentsTypes.imageEditorOneColumn);
    }
    swap() {
        this.callbacks.changeType(constants.contentsTypes.imageEditorTwoColumns);
        this.save();
    }
    _changeType(type) {
        if (this.contentType() === type) {
            return;
        }

        this.callbacks.changeType(type);
        this.contentType(type);
        this.save();
    }
    upload() {
        imageUpload.upload({
            startLoading: () => {
                this.isLoading(true);
            },
            success: (url) => {
                this.imageChanged(url);
                this.currentImageUrl(url);
                this.isLoading(false);
            },
            error: () => {
                this.isLoading(false);
            }
        });
    }
    getFromLibrary() {
        imageLibraryDialog.chooseImage(url => {
            if (!_.isNull(url)) {
                this.imageChanged(url);
                this.currentImageUrl(url);
            }
        });
    }
    getFromLink(viewmodel, evt) {
        if (this.imageUrlFromLink()) {
            this.currentImageUrl(this.imageUrlFromLink());
            this.imageChanged(this.currentImageUrl());
        }
        this.imageUrlFromLink('');
        this.linkTooltipShowed(false);
        evt.stopPropagation();
    }
    showLinkTooltip() {
        this.linkTooltipShowed(!this.linkTooltipShowed());
    }
    hideLinkTooltip() {
        this.linkTooltipShowed(false);
    }

    get className() {
        return className;
    }
}