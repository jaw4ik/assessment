'use strict';

var constants = require('../constants');
var Page = require('./page');

class CoursesPage extends Page {
    get view(){
        return $('.courses.view-module .content-section');
    }
    get pageHeader(){
        var elem = $('.page-view-caption-text');
        elem.waitForText();
        return elem;
    }
    get emptyCourseListTitle() {
        return $('.empty-list.title');
    }
    get createCourseBtn() {
        return $('.create-item.btn.green');
    }
    open() {
        super.open('#courses');
        this.view.waitForVisible(constants.PAGE_LOAD_LIMIT);
    }
}

module.exports = new CoursesPage();