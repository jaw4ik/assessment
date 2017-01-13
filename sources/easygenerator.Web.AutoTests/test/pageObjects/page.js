'use strict';

class Page {
    get title() {
        return browser.getTitle();
    }
    open(path) {
        browser.url('/' + path);
    }
};

module.exports = Page;