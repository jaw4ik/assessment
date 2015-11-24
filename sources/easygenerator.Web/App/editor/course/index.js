﻿import ko from 'knockout';
import co from 'co';
import _ from 'underscore';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import repository from 'repositories/courseRepository';
import vmContentField from 'viewmodels/common/contentField';

const eventsForCourseContent = {
    addContent: 'Define introduction',
    beginEditText: 'Start editing introduction',
    endEditText: 'End editing introduction'
};

export default class{
    constructor () {
        this.id = '';
        this.createdBy = '';
        this.objectives = ko.observableArray([]);
        this.eventTracker = eventTracker;
        this.localizationManager = localizationManager;
        this.courseIntroductionContent = null;
    }
    activate(courseId) {
        return co.call(this, function*() {
            const course = yield repository.getById(courseId);
            this.id = course.id;
            this.createdBy = course.createdBy;
            this.objectives(_.map(course.objectives, objective => objective));
            this.courseIntroductionContent = vmContentField(course.introductionContent, eventsForCourseContent, false, content => repository.updateIntroductionContent(course.id, content));
        });
    }
};