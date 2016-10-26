import binder from 'binder';
import notifyViewer from 'widgets/notifyViewer/viewmodel';
import localizationManager from 'localization/localizationManager';

const noticeTypes = {
    info: 'info',
    error: 'error',
    success: 'success'
};

class Notify {
    constructor() {
        binder.bindClass(this);
    }

    success(message) {
        this._showNotification(message, noticeTypes.success);
    }

    info(message) {
        this._showNotification(message, noticeTypes.info);
    }

    error(message) {
        this._showNotification(message || localizationManager.localize('anErrorOccurred'), noticeTypes.error);
    }

    saved() {
        let message = localizationManager.localize('allChangesAreSaved');
        this._showNotification(message, noticeTypes.success);
    }

    hide() {
        notifyViewer.notifications.removeAll();
    }

    _showNotification(text, type) {
        notifyViewer.notifications.remove(item => item.text === text && item.type === type);
        notifyViewer.notifications.push({ text, type });
    }
}

export default new Notify();