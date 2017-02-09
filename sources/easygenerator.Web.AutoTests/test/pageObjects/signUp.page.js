'use strict';

var constants = require('../constants');
var Page = require('./page');

class SignUpPage extends Page {
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
        return $('.email-error-message').waitVisible(constants.signUp.EMAIL_CHECK_WAIT_FOR);
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
        return $('.user-avatar').waitText();
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
    waitForLogin() {
        return $('.shell').waitVisible(constants.PAGE_LOAD_LIMIT);
    }
}

module.exports = new SignUpPage();