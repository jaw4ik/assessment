import ko from 'knockout';
import _ from 'underscore';
import dialog from 'widgets/dialog/viewmodel';
import eventTracker from 'eventTracker';
import constants from 'constants';
import themeRepository from 'repositories/themeRepository';

var events = {
    confirmDelete: 'Confirm delete theme',
    cancelDelete: 'Cancel delete theme'
};

class DeleteThemeViewModel {
    constructor() {
        this.themeId = '';
        this.themeName = ko.observable('');
        this.isDeleting = ko.observable(false);
    }
    show(themeId, themeName) {
        this.themeId = themeId;
        this.themeName(themeName);
        dialog.show(this, constants.dialogs.deleteItem.settings);
    }
    cancel() {
        eventTracker.publish(events.cancelDelete);
        dialog.close();
    }
    deleteTheme() {
        if (this.isDeleting()) {
            return;
        }

        this.isDeleting(true);
        eventTracker.publish(events.confirmDelete);

        return themeRepository.remove(this.themeId)
            .then(() => {
                dialog.close();
            })
            .catch(() => {
            })
            .then(() => {
                this.isDeleting(false);
            });
    }
}

export default new DeleteThemeViewModel();