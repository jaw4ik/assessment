'use strict';

var userGenerator = require('../../entityGenerators/userGenerator');
var signUpSecondPage = require('../../pageObjects/signUpSecond.page');

const TITLE = 'Sign up';
const SIGN_UP_PATH = '/signup';
const COUNTRY_NOT_SET_ERROR = 'Enter your country';
const PHONE_NOT_SET = 'Enter your phone number';
const PHONE_CODE_PLACEHOLDER = '+ ( ... )';
const AUTH_MAX_TIME = 60000;
const tokenList = ['token.api', 'token.auth', 'token.preview', 'token.saml', 'token.settings', 'token.signalr', 'token.storage', 'token.upgradeAccount'];

describe('Sign Up second step:', () => {

    describe('when user data is not presented in session', () => {
        it('should redirect to Sign up page', () => {
            browser.url(SIGN_UP_PATH);
            browser.webSessionStorage('DELETE');
            signUpSecondPage.open();
            browser.waitForUrlChange(SIGN_UP_PATH, 1000);
        });
    });

    describe('when user data is presented in session', () => {
        var user = userGenerator.uniqueUser;

        beforeEach(() => {
            browser.url(SIGN_UP_PATH);
            signUpSecondPage.setUserDataToSession(user);
            signUpSecondPage.open();
        });

        describe('title:', () => {
            it('should be set', () => {
                expect(signUpSecondPage.title).toBe(TITLE);
            });
        });

        describe('Sign Up second step form:', () => {
            it('should deny access with empty creds', () => {
                var disabled = signUpSecondPage.startAuthoring.getAttribute('disabled');
                expect(disabled).toBe('true');
            });

            describe('country selectbox:', () => {
                it('should select country', () => {
                    signUpSecondPage.setCountry(user.country);
                    expect(signUpSecondPage.countrySelectCurrent.getText()).toBe(user.country);
                });

                describe('when country is set', () => {
                    it('should fill phone code', () => {
                        signUpSecondPage.setCountry(user.country);
                        expect(signUpSecondPage.phoneCode.getText()).not.toBe(PHONE_CODE_PLACEHOLDER);
                    });
                });

                describe('when country is not set', () => {
                    beforeEach(() => {
                        signUpSecondPage.countrySelectCurrent.click();
                        signUpSecondPage.phone.click();
                    });

                    it('should not fill phone code', () => {
                        expect(signUpSecondPage.phoneCode.getText()).toBe(PHONE_CODE_PLACEHOLDER);
                    });

                    it('should show appropriate error message after lost focus', () => {
                        expect(signUpSecondPage.countryFormMessage.getText()).toBe(COUNTRY_NOT_SET_ERROR);
                    });
                });

                describe('country filter', () => {
                    it('should show options using filter', () => {
                        signUpSecondPage.countrySelectCurrent.click();
                        signUpSecondPage.countryInput.setValue(user.country.substring(0, user.country.length - 1));
                        var hasActiveClass = browser.hasClass(signUpSecondPage.getCountryOption(user.country), 'active');
                        expect(hasActiveClass).toBeTruthy();
                    });
                });
            });

            describe('phone:', () => {
                it('should set phone number', () => {
                    signUpSecondPage.phone.setValue('00');
                    expect(signUpSecondPage.phone.getValue()).toBe('00');
                });

                describe('when phone is not set', () => {
                    it('should show appropriate error message after lost focus', () => {
                        signUpSecondPage.phone.click();
                        signUpSecondPage.countrySelectCurrent.click();
                        expect(signUpSecondPage.phoneFormMessage.getText()).toBe(PHONE_NOT_SET);
                    });
                });
            });

            describe('role:', () => {
                it('should select role', () => {
                    signUpSecondPage.setRole(user.role);
                    expect(signUpSecondPage.roleSelectCurrent.getText()).toBe(user.role);
                });
            });

            describe('when creds are correct', () => {
                beforeEach(() => {
                    browser.webLocalStorage('DELETE');
                    signUpSecondPage.submitCreds(user);
                });

                it('should redirect to start page and set tokens', () => {
                    browser.waitForUrlChange('/#start', AUTH_MAX_TIME);
                    for (var i = 0; i < tokenList.length; i++) {
                        var token = browser.webLocalStorage('GET', tokenList[i]);
                        expect(token).toEqual(jasmine.any(String));
                    }
                });
            });
        });
    });
});