'use strict';

var config = require('../wdio.conf.js').config;
const WEB_STORAGE_GET = 'GET';
const WEB_STORAGE_POST = 'POST';
const WEB_STOARGE_DELETE = 'DELETE';

function add(commandName, commandMethod, overwrite) {
    return browser.addCommand(commandName, commandMethod, overwrite);
}

module.exports = {
    install() {
        add('hasClass', function(className) {
            var classList = this.getAttribute('class').split(' ');
            return classList.indexOf(className) !== -1;
        });
        add('baseUrl', function() {
            return config.baseUrl;
        });
        add('waitForUrlChange', function(expectedUrl, timeout) {
            this.waitUntil(() => {
                return this.getUrl() === (config.baseUrl + expectedUrl);
            }, timeout, `url has not been changed to ${config.baseUrl}${expectedUrl} after ${timeout} ms`);
        });
        add('selectCheckBox', function() {
            var selected = this.isSelected();
            if (!selected) {
                this.click();
            }
        });
        add('unselectCheckBox', function() {
            var selected = this.isSelected();
            if (selected) {
                this.click();
            }
        });
        add('webSessionStorage', (method, value) => {
            var result = {};
            switch (method) {
                case WEB_STORAGE_GET: {
                    result = browser.execute(function (key) {
                        return sessionStorage.getItem(key);
                    }, value);
                    break;
                }
                case WEB_STORAGE_POST: {
                    result = browser.execute(function (key, value) {
                        return sessionStorage.setItem(key, value);
                    }, value.key, value.value);
                    break;
                }
                case WEB_STOARGE_DELETE: {
                    if (value) {
                        result = browser.execute(function (key) {
                            return sessionStorage.removeItem(key);
                        }, value);
                    } else {
                        result = browser.execute(function () {
                            return sessionStorage.clear();
                        });
                    }
                    break;
                }
                default: {
                    result = browser.execute(function () {
                        return sessionStorage;
                    });
                    break;
                }
            }
            return result.value;
        });
        add('webLocalStorage', (method, value) => {
            var result = {};
            switch (method) {
                case WEB_STORAGE_GET: {
                    result = browser.execute(function (key) {
                        return localStorage.getItem(key);
                    }, value);
                    break;
                }
                case WEB_STORAGE_POST: {
                    result = browser.execute(function (key, value) {
                        return localStorage.setItem(key, value);
                    }, value.key, value.value);
                    break;
                }
                case WEB_STOARGE_DELETE: {
                    if (value) {
                        result = browser.execute(function (key) {
                            return localStorage.removeItem(key);
                        }, value);
                    } else {
                        result = browser.execute(function () {
                            return localStorage.clear();
                        });
                    }
                    break;
                }
                default: {
                    result = browser.execute(function () {
                        return localStorage;
                    });
                    break;
                }
            }
            return result.value;
        });
    }
}