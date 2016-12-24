'use strict';

var Page = require('./page');
const WAIT_TIME = 1000;
const SESSION_USER_DATA_KEY = 'userSignUpFirstStepData';

class SignUpSecondPage extends Page {
    get countrySelectBox() {
        return $('.user-form-row-combiner .user-form-selectbox.selectbox');
    }
    get countrySelectCurrent() {
        return this.countrySelectBox.$('.selectbox-current-item-text');
    }
    getCountryOption(country) {
        var element;
        if (typeof country === 'string') {
            element = this.countrySelectBox.$(`.selectbox-option-item=${country}`);
        } else {
            element = this.countrySelectBox.$(`.selectbox-option-item:nth-child(${country})`);
        }
        element.waitForVisible(WAIT_TIME);
        return element;
    }
    get countryInput() {
        return this.countrySelectBox.$('.selectbox-filter-input');
    }
    get countryFormMessage() {
        var element = $('.user-form-row-combiner .user-form-row:nth-child(1) .user-form-message');
        element.waitForVisible(WAIT_TIME);
        return element;
    }
    get phoneCode() {
        return $('.phone-code-wrapper');
    }
    get phone() {
        return $('.user-form-input.phone');
    }
    get phoneFormMessage() {
        var element = $('.user-form-row-combiner .user-form-row:nth-child(2) .user-form-message');
        element.waitForVisible(WAIT_TIME);
        return element;
    }
    get roleSelectBox() {
        return $('#signUpForm > .user-form-row .user-form-selectbox.selectbox');
    }
    get roleSelectCurrent() {
        return this.roleSelectBox.$('.selectbox-current-item-text');
    }
    getRoleOption(role) {
        var element;
        if (typeof role === 'string') {
            element = this.roleSelectBox.$(`.selectbox-option-item=${role}`);
        } else {
            element = this.roleSelectBox.$(`.selectbox-option-item:nth-child(${role})`);
        }
        element.waitForVisible(WAIT_TIME);
        return element;
    }
    get startAuthoring() {
        return $('.user-form-btn');
    }
    open() {
        super.open('signupsecondstep');
    }
    setCountry(countryName) {
        this.countrySelectCurrent.click();
        var option = this.getCountryOption(countryName);
        option.click();
    }
    setRole(roleName) {
        this.roleSelectCurrent.click();
        var option = this.getRoleOption(roleName);
        option.click();
    }
    setUserDataToSession(user) {
        var value = {
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName
        };
        return browser.webSessionStorage('POST', {
            key: SESSION_USER_DATA_KEY,
            value: JSON.stringify(value)
        });
    }
    submitCreds(user) {
        this.setCountry(user.country);
        this.phone.setValue(user.phone);
        this.setRole(user.role);
        this.startAuthoring.click();
    }
}

module.exports = new SignUpSecondPage();