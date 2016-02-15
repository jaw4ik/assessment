class ImagePreview {
    constructor() {
        this.isShown = ko.observable(false);
        this.isLoaded = ko.observable(false);
        this.images = ko.observableArray([]);
        this.current = ko.observable(0);
        
        this.imageUrl = ko.pureComputed(() => {
            return this.current() < this.images().length ? this.images()[this.current()].url : '';
        }, this);
    }

    show(index) {
        this.current(index);
        this.isShown(true);
    }

    hide() {
        this.isShown(false);
    }

    next() {
        if (this.isNextAvailable()) {
            this.current(this.current() + 1);
        }
    }

    previous() {
        if (this.isPrevAvailable()) {
            this.current(this.current() - 1);
        }
    }

    isNextAvailable() {
        return this.current() + 1 < this.images().length;
    }

    isPrevAvailable() {
        return this.current() - 1 >= 0;
    }
}

export default new ImagePreview()
