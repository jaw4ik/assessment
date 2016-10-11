import guard from 'guard';
import events from 'durandal/events';
import binder from 'binder';
import ButtonsPanelManager from './../components/ButtonsPanelManager';

export default class {
    constructor() {
        guard.throwIfNotFunction(this.activate, `Content type must contain 'activate' function. Module name: ${this.__moduleId__}`);
        guard.throwIfNotFunction(this.update, `Content type must contain 'update' function for update from collaborator. Module name: ${this.__moduleId__}`);

        binder.bindClass(this);
        events.includeIn(this);

        this.buttonsPanel = new ButtonsPanelManager();
        this.buttonsPanel.addButton('content-reordering-handle', 'changeOrder');
        this.buttonsPanel.addButton('content-duplicate', 'duplicate', this.duplicate);
        this.buttonsPanel.addButton('content-delete', 'delete', this.delete);
    }
    save(data) {
        this.trigger('save', data);
    }
    delete() {
        this.trigger('deleteContent');
    }
    duplicate() {
        this.trigger('duplicateContent');
    }
    startEditing() {
        this.trigger('startEditing');
    }
    endEditing() {
        this.trigger('endEditing');
    }
    enableOverlay() {
        this.trigger('enableOverlay');
    }
    disableOverlay() {
        this.trigger('disableOverlay');
    }
}