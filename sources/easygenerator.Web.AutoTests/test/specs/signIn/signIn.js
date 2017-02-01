'use strict';

var appData = require('../../../data/dbData/app');
var page = require('../../pageObjects/signIn.page');
var constants = require('../../constants');

describe('Sign In:', () => {

    beforeEach(() => {
        page.open();
    });

    describe('title:', () => {
        it('should be set', () => {
            expect(page.title).toBe(constants.signIn.TITLE);
        });
    });

    describe('Sign in form:', () => {

        describe('form title:', () => {
            it('should be set', () => {
                expect(page.formTitle.getText()).toBe(constants.signIn.TITLE);
            });
        });

        describe('when user does not exist in databse', () => {
            beforeEach(() => {
                page.signIn(appData.users.notExisting.email, constants.DEFAULT_PASSWORD);
            });

            it('should show error message', () => {
                expect(page.formWarning.getText()).toBe(constants.signIn.INCORRECT_CREDENTIALS);
            });
        });

        describe('when user exists in databases', () => {
            describe('and email is incorrect', () => {
                beforeEach(() => {
                    page.signIn(constants.INCORRECT_EMAIL, constants.DEFAULT_PASSWORD);
                });

                it('should show error message', () => {
                    expect(page.emailWarning.getText()).toBe(constants.signIn.INCORRECT_EMAIL);
                });
            });

            describe('and email/password combination does not exist', () => {
                beforeEach(() => {
                    page.signIn(appData.users.justCreated.email, constants.DEFAULT_PASSWORD);
                });

                it('should show error message', () => {
                    expect(page.formWarning.getText()).toBe(constants.signIn.INCORRECT_CREDENTIALS);
                });
            });

            describe('and email/password combination exists', () => {
                beforeEach(() => {
                    page.signIn(appData.users.justCreated.email, appData.users.justCreated.password);
                });

                it('should navigate to courses page and display name', () => {
                    var changed = browser.waitForUrlChange(['', '/', '/#courses'], constants.signIn.LOGIN_WAIT_FOR);
                    page.view.waitForVisible(constants.PAGE_LOAD_LIMIT);
                    expect(changed).toBe(true);
                    expect(page.userAvatar.getText()).toBe(appData.users.justCreated.firstName[0]);
                });
            });
        });
    });
});