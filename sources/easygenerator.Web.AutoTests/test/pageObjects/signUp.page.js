'use strict';

var constants = require('../constants');
var Page = require('./page');

class SignUpPage extends Page {
    get view(){
        return $('.shell');
    }
    get formTitle(){
        return $('.user-title');
    }
    get firstName() {
        return $('.user-form-input[name="firstName"]');
    }
    get firstNameWarning() {
        return $('.first-name-error-message');
    }
    get lastName() {
        return $('.user-form-input[name="lastName"]');
    }
    get lastNameWarning() {
        return $('.last-name-error-message');
    }
    get email() {
        return $('.user-form-input[name="email"]');
    }
    get emailWarning() {
        var elem = $('.email-error-message');
        elem.waitForVisible(constants.signUp.EMAIL_CHECK_WAIT_FOR);
        return elem;
    }
    get password() {
        return $('.user-form-input[name="password"]');
    }
    get passwordLengthControl() {
        return $('.password-symbols-requirement');
    }
    get passwordSpacesControl() {
        return $('.password-spaces-requirement');
    }
    get showHidePasswordCheckbox() {
        return $('#show-hide-password-checkbox');
    }
    get signUpBtn() {
        return $('.user-form-btn');
    }
    get userAvatar(){
        var elem = $('.user-avatar');
        elem.waitForVisible(3000);
        elem.waitForText();
        return elem;
    }
    open() {
        super.open('signup');
    }
    signUp(user) {
        this.firstName.setValue(user.firstName);
        this.lastName.setValue(user.lastName);
        this.email.setValue(user.email);
        this.password.setValue(user.password);
        this.signUpBtn.click();
    }
}

module.exports = new SignUpPage();