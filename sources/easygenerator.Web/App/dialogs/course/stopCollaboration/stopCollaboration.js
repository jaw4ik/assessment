import ko from 'knockout';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import finishCollaborationCommand from 'commands/collaboration/finishCollaborationCommand';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';

var events = {
    stopCollaboration: 'Stop being a co-author'
};

class StopCollaborationDialog{
    constructor() {
        this.isStopping = ko.observable(false);
    }

    show(courseId, courseTitle) {
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.isStopping(false);
        dialog.show(this, constants.dialogs.deleteItem.settings);
    }

    cancel() {
        dialog.close();
    }

    async stopCollaboration(){
        eventTracker.publish(events.stopCollaboration);
        this.isStopping(true);
        try {
            await finishCollaborationCommand.execute(this.courseId);
            this.isStopping(false);
            dialog.close();
        } catch (e) {
            this.isStopping(false);
            notify.error(localizationManager.localize('responseFailed'));
        }
    }
}

export default new StopCollaborationDialog();