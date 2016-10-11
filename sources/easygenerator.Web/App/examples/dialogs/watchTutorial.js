import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';

export default class WatchTutorial {
    constructor(title, url, callback) {
        this.title = title;
        this.url = url;
        this.callback = callback;
    }
    
    activate() {}

    show() {
        dialog.show(this, constants.dialogs.watchTutorial.settings);
    }

    submit() {
        dialog.close();
        dialog.on(constants.dialogs.dialogClosed, this.closed.bind(this));
    }

    closed() {
        dialog.off(constants.dialogs.dialogClosed);
        this.callback();
    }
};

