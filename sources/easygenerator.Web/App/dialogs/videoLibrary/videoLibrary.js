import _ from 'underscore';
import ko from 'knockout';
import dialog from 'widgets/dialog/viewmodel';
import constants from 'constants';
import preview from 'dialogs/video/video';
import binder from 'binder';
import uploadManager from 'videoUpload/uploadManager';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';

class VideoLibraryDialog {
    constructor () {
        binder.bindClass(this);

        this.selectedVideoId = ko.observable(null);
        this.videos = null;
        this.storageSpace = null;
        this.statuses = constants.storage.video.statuses;

        this.videos = uploadManager.videos;
        this.storageSpace = uploadManager.storageSpace;
    }

    uploadVideo() {
        let accountCanUpload = uploadManager.uploadVideo();
        if (!accountCanUpload) {
            upgradeDialog.show(constants.dialogs.upgrade.settings.videoUpload);
        }
    }

    activate() {
        this.selectedVideoId(null);
    }

    selectVideo(video) {
        this.selectedVideoId(video.id);
    }

    showVideoPopup(video) {
        if (!video.vimeoId()) {
            return;
        }

        preview.show({ vimeoId: video.vimeoId(), enableVideo: true });
    }

    chooseVideo(callback) {
        dialog.show(this, constants.dialogs.mediaLibraryDialog.settings);
        this.callback = callback;
    }

    showDeleteVideoConfirmation(video) {
        video.isDeleteConfirmationShown(true);
    }

    hideDeleteVideoConfirmation(video) {
        video.isDeleteConfirmationShown(false);
    }

    done() {
        let selectedVideo = _.find(this.videos(), video => video.id === this.selectedVideoId());
        this.callback(selectedVideo ? selectedVideo : null);
        dialog.close();
    }
}

 export default new VideoLibraryDialog();