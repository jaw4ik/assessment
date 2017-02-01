'use strict';

class Page {
    get title() {
        return browser.getTitle();
    }
    open(path, reopen) {
        if(reopen || (browser.getUrl() !== browser.baseUrl() + '/' +  path)){
            browser.url('/' + path);
        }
    }
};

module.exports = Page;