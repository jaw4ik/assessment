'use strict';

var Page = require('./page');

class SignInPage extends Page {
    get view(){
        return $('.shell');
    }
    get formTitle(){
        return $('.user-title');
    }
    get email() {
        return $('.user-form-input[name="email"]');
    }
    get password() {
        return $('.user-form-input[name="password"]');
    }
    get submitBtn() {
        return $('.user-form-btn[type="submit"]');
    }
    get formWarning(){
        var elem = $('.user-form-notification-text');
        elem.waitForText();
        return elem;
    }
    get emailWarning(){
        var elem = $('.user-form-message');
        elem.waitForText();
        return elem;
    }
    get userAvatar(){
        var elem = $('.user-avatar');
        elem.waitForVisible(3000);
        elem.waitForText();
        return elem;
    }
    open() {
        super.open('signin');
    }
    signIn(email, password) {
        this.email.setValue(email);
        this.password.setValue(password);
        this.submitBtn.click();
    }
}

module.exports = new SignInPage();