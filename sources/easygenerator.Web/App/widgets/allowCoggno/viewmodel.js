import _ from 'underscore';
import ko from 'knockout';
import allowCoggnoCommand from 'commands/allowCoggnoCommand';
import binder from 'binder';

class AllowCoggnoDialog {
    constructor() {
        binder.bindClass(this);
        this.isShown = ko.observable(false);
        this.callback = null;
    }
    show(callback = null) {
        this.callback = null;
        if(_.isFunction(callback)) {
            this.callback = callback;
        }
        this.isShown(true);
    }
    hide() {
        this.isShown(false);
    }
    async allow() {
        await allowCoggnoCommand.execute();
        this.hide();
        if (!this.callback) {
            return false;
        }
        return this.callback();
    }
}

export default new AllowCoggnoDialog();