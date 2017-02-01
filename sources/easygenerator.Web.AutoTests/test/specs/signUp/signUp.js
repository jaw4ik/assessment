'use strict';

var appData = require('../../../data/dbData/app');
var page = require('../../pageObjects/signUp.page');
var constants = require('../../constants');

describe('Sign Up:', () => {

    beforeEach(() => {
        page.open();
    });

    describe('title', () => {
        it('should be set', () => {
            expect(page.title).toBe(constants.signUp.TITLE);
        });
    });

    describe('Sign up form:', () => {
        describe('form title:', () => {
            it('should be set', () => {
                expect(page.formTitle.getText()).toBe(constants.signUp.FORM_TITLE);
            });
        });

        describe('when creadentials are not set', () => {
            it('should disable form submiting', () => {
                var disabled = page.signUpBtn.getAttribute('disabled');
                expect(disabled).toBe('true');
            });
        });

        describe('when firstName is empty', () => {
            it('should show error message', () => {
                page.firstName.setValue('');
                page.lastName.click();
                expect(page.firstNameWarning.getText()).toBe(constants.signUp.INCORRECT_FIRST_NAME);
            });
        });

        describe('when lastName is empty', () => {
            it('should show error message', () => {
                page.lastName.setValue('');
                page.firstName.click();
                expect(page.lastNameWarning.getText()).toBe(constants.signUp.INCORRECT_LAST_NAME);
            });
        });

        describe('when email already exists', () => {
            beforeEach(() => {
                page.email.setValue(appData.users.justCreated.email);
                page.firstName.click();
            });

            it('should show error message', () => {
                expect(page.emailWarning.getText()).toBe(constants.signUp.EMAIL_EXISTS);
            });
        });

        describe('when email is incorrect', () => {
            beforeEach(() => {
                page.email.setValue(constants.INCORRECT_EMAIL);
                page.firstName.click();
            });

            it('should show error message', () => {
                expect(page.emailWarning.getText()).toBe(constants.signUp.INCORRECT_EMAIL);
            });
        });

        describe('when password length is lesser than 7 characters', () => {
            beforeEach(() => {
                page.password.setValue('123');
            });

            it('should not mark password as successful', () => {
                expect(page.passwordLengthControl.hasClass('success')).toBeFalsy();
            });
        });

        describe('when password contains spaces', () => {
            beforeEach(() => {
                page.password.setValue('1 2');
            });

            it('should not mark password as successful', () => {
                expect(page.passwordSpacesControl.hasClass('success')).toBeFalsy();
            });
        });

        describe('when password is correct', () => {
            beforeEach(() => {
                page.password.setValue(constants.DEFAULT_PASSWORD);
                page.email.click();
            });

            it('should pass length-control check', () => {
                expect(page.passwordLengthControl.hasClass('success')).toBeTruthy();
            });

            it('should pass space-control check', () => {
                expect(page.passwordSpacesControl.hasClass('success')).toBeTruthy();
            });
        });

        describe('when show password option is not set', () => {
            beforeEach(() => {
                page.showHidePasswordCheckbox.unselectCheckBox();
                page.password.setValue('I am hidden');
            });

            it('should hide password', () => {
                expect(page.password.getAttribute('type')).toBe("password");
            });
        });

        describe('when show password option is set', () => {
            beforeEach(() => {
                page.showHidePasswordCheckbox.selectCheckBox();
                page.password.setValue('I am visible');
            });

            it('should show password', () => {
                expect(page.password.getAttribute('type')).toBe("text");
            });
        });

        describe('when creadentials are correct', () => {
            beforeEach(() => {
                page.signUp(appData.users.notExisting);
            });

            it('should navigate to courses page and display name', () => {
                var changed = browser.waitForUrlChange(['', '/', '/#courses'], constants.signUp.LOGIN_WAIT_FOR);
                page.view.waitForVisible(constants.PAGE_LOAD_LIMIT);
                expect(changed).toBe(true);
                expect(page.userAvatar.getText()).toBe(appData.users.notExisting.firstName[0]);
            });
        });
    });
});