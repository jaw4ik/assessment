import notify from 'notify';
import router from 'plugins/router';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';

let events = {
    openCommentedItemInEditor: 'Open commented item in the editor'
};

export default class {
    constructor(courseId, title) {
        this.title = title;
        this.courseId = courseId;
    }

    open() {
        eventTracker.publish(events.openCommentedItemInEditor);

        let url = this.getEntityUrl();
        if(url) {
            router.navigate(url);
        }else {
            notify.error(localizationManager.localize('cannotFindCommentedItem'));
        }
    }

    getEntityUrl(){}
}