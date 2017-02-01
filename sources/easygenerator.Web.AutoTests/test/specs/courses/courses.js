'use strict';

var appData = require('../../../data/dbData/app');
var page = require('../../pageObjects/courses.page');
var constants = require('../../constants');

describe('Courses page:', () => {

    beforeAll(() => {
        browser.logout();
        browser.login(appData.users.justCreated.email, appData.users.justCreated.password);
    });

    beforeEach(() => {
        page.open();
    });

    describe('title:', () => {
        it('should be set', () => {
            expect(page.title).toBe(constants.courses.TITLE);
        });
    });

    describe('page header:', () => {
        it('should be set', () => {
            expect(page.pageHeader.getText()).toBe(constants.courses.PAGE_HEADER);
        });
    });

});