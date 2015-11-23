import ko from 'knockout';
import co from 'co';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import repository from 'repositories/courseRepository';
import vmContentField from 'viewmodels/common/contentField';

var eventsForCourseContent = {
    addContent: 'Define introduction',
    beginEditText: 'Start editing introduction',
    endEditText: 'End editing introduction'
};

function activate(courseId) {
    return co.call(this, function*() {
        var course = yield repository.getById(courseId);
        this.id = course.id;
        this.createdBy = course.createdBy;
        this.objectives(_.map(course.objectives, objective => objective));
        this.courseIntroductionContent = vmContentField(course.introductionContent, eventsForCourseContent, false, content => repository.updateIntroductionContent(course.id, content));
    });
}

export default {
    id: '',
    createdBy: '',
    objectives: ko.observableArray([]),
    eventTracker: eventTracker,
    localizationManager: localizationManager,
    courseIntroductionContent: null,
    activate: activate
}

//export default class{
//    constructor () {
//        this.id = '';
//        this.createdBy = '';
//        this.objectives = ko.observableArray([]);
//        this.eventTracker = eventTracker;
//        this.localizationManager = localizationManager;
//        this.courseIntroductionContent = null;
//        this.viewUrl = 'editor/course/index';
//    }
//    activate(courseId) {
//        debugger;
//        return co.call(this, function*() {
//            let course = yield repository.getById(courseId);
//            this.id = course.id;
//            this.createdBy = course.createdBy;
//            this.objectives(_.map(course.objectives, objective => objective));
//            this.courseIntroductionContent = vmContentField(course.introductionContent, eventsForCourseContent, false, content => repository.updateIntroductionContent(course.id, content));
//        });
//    }
//};
export var __useDefault = true;