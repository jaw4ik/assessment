import ko from 'knockout';
import constants from 'constants';

export default class {
    constructor(spec) {
        this.associatedLearningContentId = spec.associatedLearningContentId || null;
        this.id = spec.id || null;
        this.title = spec.title || null;
        this.vimeoId = ko.observable(spec.vimeoId || null);
        this.createdOn = ko.observable(spec.createdOn || null);
        this.modifiedOn = ko.observable(spec.modifiedOn || null);
        this.thumbnailUrl = ko.observable(spec.thumbnailUrl || null);
        this.progress = ko.observable(spec.progress || null);
        this.status = ko.observable(spec.status || constants.storage.video.statuses.loaded);
        this.isDeleteConfirmationShown = ko.observable(false);
        this.isDeleting = ko.observable(false);
    }

    update(source) {
        this.associatedLearningContentId = source.associatedLearningContentId;
        this.vimeoId(source.vimeoId);
        this.createdOn(source.createdOn);
        this.modifiedOn(source.modifiedOn);
        this.thumbnailUrl(source.thumbnailUrl);
        this.progress(source.progress);
        this.status(source.status);
        this.isDeleteConfirmationShown(source.isDeleteConfirmationShown);
        this.isDeleting(source.isDeleting);
    }
}