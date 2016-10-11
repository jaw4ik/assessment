import guard from 'guard';
import _ from 'underscore';
import PanelButton from './PanelButton';

export default class {
    constructor() {
        this.buttons = [];
    }
    addButton(cssClass, resourceKey, handler, position) {
        guard.throwIfNotString(cssClass, 'Button must have a css class.');
        guard.throwIfNotString(resourceKey, 'Button must have a resource key.');

        let newButton = new PanelButton(cssClass, resourceKey, handler);
        
        if (_.isNullOrUndefined(position)) {
            this.buttons.push(newButton);
        } else {
            this.buttons.splice(position - 1, 0, newButton);
        }
    }
}