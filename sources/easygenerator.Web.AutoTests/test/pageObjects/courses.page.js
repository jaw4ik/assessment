'use strict';

var constants = require('../constants');
var Page = require('./page');

class CoursesPage extends Page {
    get pageHeader(){
        return $('.page-view-caption-text').waitText();
    }
    get emptyCourseListTitle() {
        return $('.empty-list.title').waitText();
    }
    get createCourseBtn() {
        return $('.create-item.btn.green').waitText();
    }
    get courseList(){
        return $('.main-content-list').waitText();
    }
    get courseTitles(){
         return this.courseList.$$('.main-content-list-item .list-item-title .selectable');
    }
    open(reopen) {
        super.open('#courses', reopen);
    }
    waitForLoad(){
        return $('.courses.view-module .content-section').waitVisible(constants.PAGE_LOAD_LIMIT);
    }
}

module.exports = new CoursesPage();