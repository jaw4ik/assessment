import ko from 'knockout';
import binder from 'binder';
import constants from 'constants';
import notify from 'notify';
import VideoFrame from './components/videoFrame/viewmodel';
import uploadSettings from 'videoUpload/settings';
import VideoModel from 'videoUpload/models/VideoModel'; 
import uploadManager from 'videoUpload/uploadManager';
import videoLibrary from 'dialogs/videoLibrary/videoLibrary';
import 'components/bindingHandlers/floatingToolbarBindingHandler';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import htmlEncode from 'utils/htmlEncode';

const playerUrl = `${constants.player.host}?source={ID}&video=1&fullscreen_toggle=1&v=${constants.appVersion}`;

export default class VideoEditor {
    constructor(data, callbacks, learningContentId, contentType) {
        binder.bindClass(this);
        this.viewUrl = 'contentEditor/contentTypes/editors/videoEditor/index.html';
        this.playerUrl = playerUrl;

        this.videoFrameTextAreaInputValue = ko.observable('');
        this.data = ko.observable(htmlEncode(data));

        this.contentType = ko.observable(contentType);
        this.callbacks = callbacks;
        this.isPending = ko.observable(false);        
        this.contentsTypes = constants.contentsTypes;
        this.statuses = constants.storage.video.statuses;
        this.storageSpace = uploadManager.storageSpace;

        this.isReadyForEdit = ko.observable(false);
        this.isResizeMode = ko.observable(false);
        this.isEditMode = ko.observable(false);
        this.scale = ko.observable(1);
        this.isLoading = ko.observable(false);        
        
        this.linkTooltipShowed = ko.observable(true);
        this.isSizeChanged = ko.observable(false);

        this.associatedLearningContentId = learningContentId;
        this.video = new VideoModel({});

        let videoFrameParams = VideoFrame.getFrameParamsFromHtml(this.data());
        this.videoFrame = new VideoFrame(videoFrameParams.src, videoFrameParams.width, videoFrameParams.height);
    }

    upload() {
        this.video.progress(null);

        let accountCanUpload = uploadManager.uploadVideo(
            uploadSettings, 
            this.associatedLearningContentId, 
            () => {
                this.stopEditMode(); 
                this.isPending(true);
                setTimeout(() => {
                    if (this.isPending()) {
                        this.isPending(false);
                        notify.error(uploadSettings.uploadErrorMessage);
                    }
                }, constants.storage.video.pendingTimeout);
            }.bind(this));

        if (!accountCanUpload) {
            upgradeDialog.show(constants.dialogs.upgrade.settings.videoUpload);
        }
    }

    updateVideoInstance(video) {
        if (this.isPending()) {
            this.isPending(false);
        }
        this.video.update(video);

        if (video.status === this.statuses.loaded) {
            this.finishedUpload(video);
        }
        if (video.status === this.statuses.failed) {
            this.failedUpload(video);
        }
    }

    finishedUpload(video) {
        let videoUrl = this.playerUrl.replace('{ID}', video.vimeoId);
        if (this.videoFrame.src() === videoUrl) return;

        this.clearAssociationBeetwenVideoAndLearningContent(video);
        this.hideProgressBar();
        this.videoFrame.src(videoUrl);
        this.store();
    }

    failedUpload(video) {
        this.clearAssociationBeetwenVideoAndLearningContent(video);
        this.hideProgressBar();
    }

    hideProgressBar() {
        this.isPending(false);
        this.video.status(this.statuses.loaded);
    }

    clearAssociationBeetwenVideoAndLearningContent(video) {
        video.associatedLearningContentId = null;
    }

    getFromLibrary() {
        videoLibrary.chooseVideo(video => {
            if (_.isNullOrUndefined(video)) return;            

            let videoUrl = this.playerUrl.replace('{ID}', video.vimeoId());
            this.videoFrame.src(videoUrl);
            this.store();
        });
    }

    _isValidLink(url) {
        if (_.isEmpty(url)) return false;
        
        let regex = new RegExp(constants.urlRegexExpression);
        if (url.match(regex)) {
            return true;
        }
        return false;    
    }

    getFromLink() {
        let urlOrIframeString = this.videoFrameTextAreaInputValue();
        if (_.isEmpty(urlOrIframeString)) return;

        if (this._isValidLink(urlOrIframeString)) {
            this.videoFrame.src(urlOrIframeString);
            this.store();
        } else {
            if (!VideoFrame.isFrameValid(urlOrIframeString)) return;
            let videoFrameParams = VideoFrame.getFrameParamsFromHtml(urlOrIframeString);
            this.videoFrame = new VideoFrame(videoFrameParams.src, videoFrameParams.width, videoFrameParams.height);
            this.store();
        }
        
        this.videoFrameTextAreaInputValue('');
        this.linkTooltipShowed(false);
    }

    _changeType(type) {
        if (this.contentType() === type) {
            return;
        }
        this.callbacks.changeType(type);
        this.contentType(type);
        this.callbacks.save();
    }
    
    store() {
        this.data(this.videoFrame.toHtml());
        this.callbacks.save();
    }

    startEditMode() {
        if (this.isEditMode()) return;
        if (this.video.status() === this.statuses.inProgress || this.isPending()) return;
       
        this.isEditMode(true);
        this.callbacks.startEditing();
    }

    stopEditMode() {
        if (!this.isEditMode()) return;

        this.isEditMode(false);
        this.callbacks.endEditing();
    }

    toLeft() {
        this._changeType(constants.contentsTypes.videoInTheLeft);
    }

    toRight() {
        this._changeType(constants.contentsTypes.videoInTheRight);
    }

    toCenter() {
        this._changeType(constants.contentsTypes.videoWithText);
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

export const className = VideoEditor.name; 