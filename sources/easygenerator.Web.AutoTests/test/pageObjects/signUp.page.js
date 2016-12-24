'use strict';

var Page = require('./page');
const WAIT_TIME = 1000;
const SESSION_USER_DATA_KEY = 'userSignUpFirstStepData';

class SignUpPage extends Page {
    get firstName() {
        return $('.user-form-input[name="firstName"]');
    }
    get firstNameFormMessage() {
        var element = $('.user-form-row-combiner .user-form-row:nth-child(1) .user-form-message');
        element.waitForVisible(WAIT_TIME);
        return element;
    }
    get lastName() {
        return $('.user-form-input[name="lastName"]');
    }
    get lastNameFormMessage() {
        var element = $('.user-form-row-combiner .user-form-row:nth-child(2) .user-form-message');
        element.waitForVisible(WAIT_TIME);
        return element;
    }
    get email() {
        return $('.user-form-input[name="email"]');
    }
    get emailFormMessage() {
        var element = $('.user-form-input-holder.email ~ .user-form-message');
        element.waitForVisible(WAIT_TIME*10);
        return element;
    }
    get password() {
        return $('.user-form-input[name="password"]');
    }
    get passwordLengthControl() {
        return $('.password-requirements-item:nth-child(2) .password-requirements-item-text');
    }
    get passwordSpacesControl() {
        return $('.password-requirements-item:nth-child(3) .password-requirements-item-text');
    }
    get togglePasswordVisibility() {
        return $('#show-hide-password-checkbox');
    }
    get signUp() {
        return $('.user-form-btn');
    }
    get sessionUserData() {
        return JSON.parse(browser.webSessionStorage('GET', SESSION_USER_DATA_KEY));
    }
    open() {
        super.open('signup');
    }
    sumbitCreds(user) {
        this.firstName.setValue(user.firstName);
        this.lastName.setValue(user.lastName);
        this.email.setValue(user.email);
        this.password.setValue(user.password);
        this.signUp.click();
    }
}

module.exports = new SignUpPage();