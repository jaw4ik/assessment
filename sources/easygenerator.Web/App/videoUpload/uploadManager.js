import app from 'durandal/app';
import ko from 'knockout';
import _ from 'underscore';
import binder from 'binder';
import repository from 'repositories/videoRepository';
import videoCommands from 'commands/videos/index';
import constants from 'constants';
import { className as videoEditorClassName } from 'contentEditor/contentTypes/editors/videoEditor/index';
import { map } from 'videoUpload/mappers/videoMapper';
import userContext from 'userContext';
import uploadSettings from 'videoUpload/settings';
import utils from 'utils/observableHelpers';

let eventCategory = 'Video library',
    events = {
        openUploadVideoDialog: 'Open \"choose video file\" dialog',
        deleteVideoFromLibrary: 'Delete video from library'
    }

class VideoUploadManager {
    constructor() {
        binder.bindClass(this);

        this.videos = ko.observableArray([]);
        this.editorsForUpdate = ko.observableArray([]);
        this.storageSpace = ko.observable(false);
        
        userContext.identifyStoragePermissions().then(() => {
            videoCommands.getCollection().then((videos) => {
                this.setAvailableStorageSpace();
                this.videos(videos);
            });
        });

        app.on(constants.storage.video.changesInUpload, this.updateVideosListener);
        app.on(constants.storage.changesInQuota, this.setAvailableStorageSpace);
    }  

    async updateVideosListener() {
        let videoCollection = await repository.getCollection();
        
        for (let video of videoCollection) {
            var newViewModelVideo = _.find(this.videos(), (currentVideo) => {
                return video.id === currentVideo.id;
            });

            if (!newViewModelVideo) {
                this.videos.unshift(map(video));
            } else {
                this.updateVideosInEditors(video, this.editorsForUpdate()); 
                
                if (!utils.equals(newViewModelVideo, video))  
                    newViewModelVideo.update(video);
            }
        }

        for (let currentVideo of this.videos()) {
            let video = _.find(videoCollection, (videoFromCollection) => { return videoFromCollection.id === currentVideo.id; });
            if (!video) {
                var index = this.videos().indexOf(currentVideo);
                this.videos.splice(index, 1);
            }
        }
    }

    updateVideosInEditors(video, editorsForUpdate) {
        for (let editor of editorsForUpdate) {
            if (video.associatedLearningContentId === editor.associatedLearningContentId || video.id === editor.video.id) {
                setTimeout(() => { editor.updateVideoInstance(video); }, 0);
            } 
        }
    }
            
    uploadVideo(settings = uploadSettings, associatedLearningContentId, callback) {
        return videoCommands.addVideo(events.openUploadVideoDialog, eventCategory, settings, associatedLearningContentId, callback);
    }

    setAvailableStorageSpace() {
        this.storageSpace(videoCommands.getAvailableStorageSpace());
    }
}

export default new VideoUploadManager();