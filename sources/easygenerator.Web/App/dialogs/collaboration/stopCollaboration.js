import ko from 'knockout';
import router from 'routing/router';
import finishCollaborationCommand from 'commands/collaboration/finishCollaborationCommand';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';

var events = {
    stopCollaboration: 'Stop being a co-author'
};

class StopCollaboration{
    constructor() {
        this.isStopCollaborationPopoverShown = ko.observable(false);
        this.isCollaborationFinishing = ko.observable(false);
    }

    init(callback) {
        this.stopCollaborationCallback = callback;
    }

    reset() {
        this.isCollaborationFinishing(false);
        this.isStopCollaborationPopoverShown(false);
    }

    showStopCollaborationPopover() {
        this.isStopCollaborationPopoverShown(true);
    }

    hideStopCollaborationPopover() {
        this.isStopCollaborationPopoverShown(false);
    }

    async stopCollaboration() {
        eventTracker.publish(events.stopCollaboration);
        this.isCollaborationFinishing(true);
        try {
            await finishCollaborationCommand.execute(router.routeData().courseId);

            if(this.stopCollaborationCallback) {
                this.stopCollaborationCallback();
            }

            router.navigate('courses');
        } catch (e) {
            this.isCollaborationFinishing(false);
            notify.error(localizationManager.localize('responseFailed'));
        }
    }
}

export default new StopCollaboration();