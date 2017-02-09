'use strict';

var config = require('../wdio.conf.js').config;
const WEB_STORAGE_GET = 'GET';
const WEB_STORAGE_POST = 'POST';
const WEB_STOARGE_DELETE = 'DELETE';
const BUFFER_PAGE = '/signin';

function add(commandName, commandMethod, overwrite) {
    return browser.addCommand(commandName, commandMethod, overwrite);
}

module.exports = {
    install() {
        add('hasClass', function(className) {
            var classList = this.getAttribute('class').split(' ');
            return classList.indexOf(className) !== -1;
        });
        add('waitExist', function(time) {
            this.waitForExist(time);
            return $(this.lastResult.selector);
        });
        add('waitVisible', function(time) {
            this.waitForVisible(time);
            return $(this.lastResult.selector);
        });
        add('waitText', function(time) {
            this.waitForText(time);
            return $(this.lastResult.selector);
        });
        add('baseUrl', function() {
            return config.baseUrl;
        });
        add('waitForUrlChange', function(expectedUrls, timeout) {
            var urls = [];
            if(!(expectedUrls instanceof Array)){
                urls.push(config.baseUrl + expectedUrls);
            } else{
                urls = expectedUrls.map(url => config.baseUrl + url);
            }
            try{
                this.waitUntil(() => {
                    return urls.indexOf(this.getUrl()) !== -1;
                }, timeout, `url has not been changed after ${timeout} ms`);
                return true;
            } catch(err){
                return err.message;
            }
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
        add('openBufferPageIfOutOfApp', name => {
            if(browser.getUrl().indexOf(browser.baseUrl()) === -1){
                browser.url(browser.baseUrl() + BUFFER_PAGE);
            }
        });
        add('webSessionStorage', (method, value) => {
            browser.openBufferPageIfOutOfApp();
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
            browser.openBufferPageIfOutOfApp();
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
        add('login', (email, password) => {
            browser.openBufferPageIfOutOfApp();
            browser.timeouts('script', 5000);
            var result = browser.executeAsync(function (email, password, done) {
                window.$.ajax({
                    url: '/auth/token',
                    data: {
                        username: email,
                        password: password,
                        grant_type: "password",
                        endpoints: ["api", "auth", "storage", "signalr", "preview", "upgradeAccount", "settings", "saml"],
                        grecaptchaResponse: ''
                    },
                    type: 'POST'
                }).done(function(response){
                    if(response && response.success){
                        window.auth.login(response.data).then(function(success) {
                            if (success) {
                                done(true);
                            } else {
                                done(false);
                            }
                        });
                    } else {
                        done(false);
                    }
                }).error(function(){
                    done(false);
                });
            }, email, password);
            return result.value;
        });
        add('isLogedIn', email => {
            browser.openBufferPageIfOutOfApp();
            browser.timeouts('script', 5000);
            var result = browser.executeAsync(function (email, done) {
                window.auth.checkUserLogIn().then(function(isLoggedIn) {
                    if (isLoggedIn || window.auth.isAuthTokenPresentInHash()) {
                        if(!email){
                            done(true);
                            return;
                        }
                        window.auth.getToken('auth').then(function(token){
                            done(email === JSON.parse(window.atob(token.split('.')[1])).unique_name);
                        });
                        return;
                    }
                    done(false);
                });
            }, email);
            return result.value;
        }); 
        add('loginIfNotLogedIn', (email, password, emailToCheck) => {
            if(!browser.isLogedIn(emailToCheck)){
                return browser.login(email, password);
            }
            return false;
        });
        add('logout', () => {
            browser.openBufferPageIfOutOfApp();
            browser.timeouts('script', 5000);
            var result = browser.executeAsync(function (done) {
                window.auth.logout().then(function(){
                    done(true);
                }).catch(function(){
                    done(false);
                });
            });
            return result.value;
        });
    }
}