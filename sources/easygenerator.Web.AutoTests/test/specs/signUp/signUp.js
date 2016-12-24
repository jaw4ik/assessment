'use strict';

var userGenerator = require('../../entityGenerators/userGenerator');
var signUpPage = require('../../pageObjects/signUp.page');

const TITLE = 'Sign up';
const FIRST_NAME_ERROR = 'Enter your first name';
const LAST_NAME_ERROR = 'Enter your last name';
const EXISTING_USER_EMAIL = 'existing@easygenerator.com';
const EMAIL_EXISTING_ERROR = 'This account already exists. Click on Sign in and try again.';
const INCORRECT_EMAIL = 'incorrect email';
const EMAIL_INCORRECT_ERROR = 'Enter a valid e-mail address';

describe('Sign Up:', () => {

    beforeEach(() => {
        signUpPage.open();
    });

    describe('title', () => {
        it('should be set', () => {
            expect(signUpPage.title).toBe(TITLE);
        });
    });

    describe('Sign Up form:', () => {
        it('should deny access with empty creds', () => {
            var disabled = signUpPage.signUp.getAttribute('disabled');
            expect(disabled).toBe('true');
        });

        it('should show error message when firstName is empty after lost focus', () => {
            signUpPage.firstName.setValue('');
            signUpPage.lastName.click();
            var errorMessage = signUpPage.firstNameFormMessage.getText();
            expect(errorMessage).toBe(FIRST_NAME_ERROR);
        });

        it('should show error message when lastName is empty after lost focus', () => {
            signUpPage.lastName.setValue('');
            signUpPage.firstName.click();
            var errorMessage = signUpPage.lastNameFormMessage.getText();
            expect(errorMessage).toBe(LAST_NAME_ERROR);
        });

        describe('when entered email already exists', () => {
            beforeEach(() => {
                signUpPage.email.setValue(EXISTING_USER_EMAIL);
                signUpPage.firstName.click();
            });

            it('should show appropriate error message after lost focus', () => {
                var errorMessage = signUpPage.emailFormMessage.getText();
                expect(errorMessage).toBe(EMAIL_EXISTING_ERROR);
            });
        });

        describe('when entered email is incorrect', () => {
            beforeEach(() => {
                signUpPage.email.setValue(INCORRECT_EMAIL);
                signUpPage.firstName.click();
            });

            it('should show appropriate error message after lost focus', () => {
                var errorMessage = signUpPage.emailFormMessage.getText();
                expect(errorMessage).toBe(EMAIL_INCORRECT_ERROR);
            });
        });

        describe('when password length is lesser than 7 characters', () => {
            beforeEach(() => {
                signUpPage.password.setValue('123');
            });

            it('should not mark appropriate condition as successful', () => {
                var hasClass = browser.hasClass(signUpPage.passwordLengthControl, 'success');
                expect(hasClass).toBeFalsy();
            });
        });

        describe('when password contains spaces', () => {
            beforeEach(() => {
                signUpPage.password.setValue('1 2');
            });

            it('should not mark appropriate condition as successful', () => {
                var hasClass = browser.hasClass(signUpPage.passwordSpacesControl, 'success');
                expect(hasClass).toBeFalsy();
            });
        });

        describe('when password is correct', () => {
            beforeEach(() => {
                signUpPage.password.setValue('1234567');
                signUpPage.email.click();
            });

            it('should mark length control as successful', () => {
                var lengthSuccess = browser.hasClass(signUpPage.passwordLengthControl, 'success');
                expect(lengthSuccess).toBeTruthy();
            });

            it('should mark space control as successful', () => {
                var spacesSuccess = browser.hasClass(signUpPage.passwordSpacesControl, 'success');
                expect(spacesSuccess).toBeTruthy();
            });
        });

        describe('when show password option is not set', () => {
            beforeEach(() => {
                var checkbox = signUpPage.togglePasswordVisibility;
                browser.unselectCheckBox(checkbox);
                signUpPage.password.setValue('I am hidden');
            });

            it('should hide password', () => {
                var type = signUpPage.password.getAttribute('type');
                expect(type).toBe("password");
            });
        });

        describe('when show password option is set', () => {
            beforeEach(() => {
                var checkbox = signUpPage.togglePasswordVisibility;
                browser.selectCheckBox(checkbox);
                signUpPage.password.setValue('I am visible');
            });

            it('should hide password', () => {
                var type = signUpPage.password.getAttribute('type');
                expect(type).toBe("text");
            });
        });

        describe('when creds are correct', () => {
            var user = userGenerator.uniqueUser;

            beforeEach(() => {
                signUpPage.sumbitCreds(user);
            });

            it('should redirect to second step', () => {
                expect(browser.getUrl()).toBe(browser.baseUrl() + '/signupsecondstep');
            });

            it('should set user data to session storage', () => {
                expect(signUpPage.sessionUserData.firstName).toBe(user.firstName);
                expect(signUpPage.sessionUserData.lastName).toBe(user.lastName);
                expect(signUpPage.sessionUserData.email).toBe(user.email);
                expect(signUpPage.sessionUserData.password).toBe(user.password);
            });

        });
    });
});