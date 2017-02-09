'use strict';

var dbData = require('../../../data/dbData');
var page = require('../../pageObjects/courses.page');
var constants = require('../../constants');

describe('Courses page:', () => {

    beforeAll(() => {
        browser.login(dbData.users.justCreated.email, dbData.users.justCreated.password);
    });

    beforeEach(() => {
        page.open();
        page.waitForLoad();
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

    describe('create course btn:', () => {
        it('should be shown', () => {
            expect(page.createCourseBtn.getText()).toBe(constants.courses.CREATE_COURSE_BTN);
        });
    });

    describe('when user have no courses', () => {
        beforeAll(() => {
            if(browser.loginIfNotLogedIn(dbData.users.justCreated.email,
                dbData.users.justCreated.password,
                dbData.users.justCreated.email)){
                page.open(true);
            }
        });

        it('should display message about empty course list', () => {
            expect(page.emptyCourseListTitle.getText()).toBe(constants.courses.EMPTY_COURSE_LIST);
        });
    });

    describe('when user have courses', () => {
        beforeAll(() => {
            if(browser.loginIfNotLogedIn(dbData.users.trial.email,
                dbData.users.trial.password,
                dbData.users.trial.email)){
                page.open(true);
            }
        });

        it('should display list of courses', () => {
            const courseTitles = page.courseTitles;
            expect(courseTitles.length).toBe(dbData.courses.trial.length);
            for(let i = 0; i < dbData.courses.trial.length; i++){
                expect(courseTitles[i].getText()).toBe(dbData.courses.trial[i].title);
            }
        });
    });
});