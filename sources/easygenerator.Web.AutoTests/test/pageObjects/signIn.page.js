'use strict';

var constants = require('../constants');
var Page = require('./page');

class SignInPage extends Page {
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
        return $('.user-form-notification-text').waitText();
    }
    get emailWarning(){
        return $('.user-form-message').waitText();
    }
    get userAvatar(){
        return $('.user-avatar').waitText();
    }
    open() {
        super.open('signin');
    }
    signIn(email, password) {
        this.email.setValue(email);
        this.password.setValue(password);
        this.submitBtn.click();
    }
    waitForLogin() {
        return $('.shell').waitVisible(constants.PAGE_LOAD_LIMIT);
    }
}

module.exports = new SignInPage();