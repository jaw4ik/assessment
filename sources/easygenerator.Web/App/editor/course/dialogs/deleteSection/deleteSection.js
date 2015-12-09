import dialog from 'widgets/dialog/viewmodel';
import dataContext from 'dataContext';
import constants from 'constants';
import eventTracker from 'eventTracker';

class DeleteSectionDialog {
    constructor () {
        //this.sectionId = sectionId;
        this.sectionTitle = 'Section title';
    }
    confirm (sectionId) {
        dialog.show(this, constants.dialogs.deleteSection.settings);
    }
}

export default new DeleteSectionDialog();