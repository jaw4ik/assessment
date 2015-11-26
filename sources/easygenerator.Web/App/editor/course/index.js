import ko from 'knockout';
import _ from 'underscore';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import courseRepository from 'repositories/courseRepository';
import vmContentField from 'viewmodels/common/contentField';
import SectionsViewModel from 'editor/course/sections/SectionsViewModel';

const eventsForCourseContent = {
    addContent: 'Define introduction',
    beginEditText: 'Start editing introduction',
    endEditText: 'End editing introduction'
};

export default class {
    constructor () {
        this.id = '';
        this.createdBy = '';
        this.sectionsViewModel = null;
        this.eventTracker = eventTracker;
        this.localizationManager = localizationManager;
        this.courseIntroductionContent = null;
    }
    async activate(courseId) {
        let course = await courseRepository.getById(courseId);
        this.id = course.id;
        this.createdBy = course.createdBy;
        this.sectionsViewModel = new SectionsViewModel(course.id, course.objectives);
        this.courseIntroductionContent = new vmContentField(course.introductionContent, eventsForCourseContent, false, content => courseRepository.updateIntroductionContent(course.id, content));
    }
};