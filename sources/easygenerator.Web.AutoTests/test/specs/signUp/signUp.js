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
                var hasClass = signUpPage.passwordLengthControl.hasClass('success');
                expect(hasClass).toBeFalsy();
            });
        });

        describe('when password contains spaces', () => {
            beforeEach(() => {
                signUpPage.password.setValue('1 2');
            });

            it('should not mark appropriate condition as successful', () => {
                var hasClass = signUpPage.passwordSpacesControl.hasClass('success');
                expect(hasClass).toBeFalsy();
            });
        });

        describe('when password is correct', () => {
            beforeEach(() => {
                signUpPage.password.setValue('1234567');
                signUpPage.email.click();
            });

            it('should mark length control as successful', () => {
                var lengthSuccess = signUpPage.passwordLengthControl.hasClass('success');
                expect(lengthSuccess).toBeTruthy();
            });

            it('should mark space control as successful', () => {
                var spacesSuccess = signUpPage.passwordSpacesControl.hasClass('success');
                expect(spacesSuccess).toBeTruthy();
            });
        });

        describe('when show password option is not set', () => {
            beforeEach(() => {
                var checkbox = signUpPage.togglePasswordVisibility;
                checkbox.unselectCheckBox();
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
                checkbox.selectCheckBox();
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
                browser.waitForUrlChange('/signupsecondstep', 3000);
            });

            it('should set user data to session storage', () => {
                var data = signUpPage.sessionUserData;
                expect(data.firstName).toBe(user.firstName);
                expect(data.lastName).toBe(user.lastName);
                expect(data.email).toBe(user.email);
                expect(data.password).toBe(user.password);
            });

        });
    });
});