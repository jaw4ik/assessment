'use strict';

var config = require('../wdio.conf.js').config;
const WEB_STORAGE_GET = 'GET';
const WEB_STORAGE_POST = 'POST';
const WEB_STOARGE_DELETE = 'DELETE';

function add(commandName, commandMethod, overwrite) {
    return browser.addCommand(commandName, commandMethod, overwrite);
}

function getElement(selector) {
    return typeof selector === 'string' ? browser.element(selector) : selector;
}

module.exports = {
    install() {
        add('hasClass', (selector, className) => {
            var element = getElement(selector);
            var classList = element.getAttribute('class').split(' ');
            return classList.indexOf(className) !== -1;
        });
        add('baseUrl', () => {
            return config.baseUrl;
        });
        add('waitForUrlChange', (expectedUrl, timeout) => {
            browser.waitUntil(() => {
                return browser.getUrl() === (config.baseUrl + expectedUrl);
            }, timeout, `url has not been changed to ${config.baseUrl}${expectedUrl} after ${timeout} ms`);
        });
        add('selectCheckBox', selector => {
            var checkbox = getElement(selector);
            var selected = checkbox.isSelected();
            if (!selected) {
                checkbox.click();
            }
        });
        add('unselectCheckBox', selector => {
            var checkbox = getElement(selector);
            var selected = checkbox.isSelected();
            if (selected) {
                checkbox.click();
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