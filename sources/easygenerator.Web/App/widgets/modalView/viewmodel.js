import ko from 'knockout';
import app from 'durandal/app';

class ModalView{
    constructor() {
        this.viewModel = ko.observable();
        this.isShown = ko.observable(false);
    }
    initialize(viewModel) {
        this.viewModel(viewModel);
    }
    open() {
        this.isShown(true);
        app.trigger('modal-view:visibility-state-changed', this.isShown());
    }
    close() {
        this.isShown(false);
        app.trigger('modal-view:visibility-state-changed', this.isShown());
    }
}

export default new ModalView();