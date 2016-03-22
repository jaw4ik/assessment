import ko from 'knockout';
import app from 'durandal/app';
import router from 'plugins/router';

let _routerNavigationProcessing = new WeakMap();

class ModalView{
    constructor() {
        this.viewModel = ko.observable();
        this.isShown = ko.observable(false);

        _routerNavigationProcessing.set(this, (instruction, router) => {
            if (instruction.config.route === '404') {
                this.close();
            }
        });

        router.on('router:navigation:processing', _routerNavigationProcessing.get(this).bind(this));
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