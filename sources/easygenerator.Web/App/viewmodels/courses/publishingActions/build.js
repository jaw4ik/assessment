import constants from 'constants';
import notify from 'notify';
import eventTracker from 'eventTracker';
import fileHelper from 'fileHelper';
import repository from 'repositories/courseRepository';
import ko from 'knockout';
import PublishingAction from './publishingAction';

const events = {
    downloadCourse: 'Download course'
};

export default class extends PublishingAction {
    constructor() {
        super();
        
        this.isPublishing = ko.computed(() => this.state() === constants.publishingStates.building, this);
    }

    async activate(courseId) {
        let course = await repository.getById(courseId);

        super.activate(course, course.build);

        this.subscribe(constants.messages.course.build.started, this.courseBuildStarted);
        this.subscribe(constants.messages.course.build.completed, this.courseBuildCompleted);
        this.subscribe(constants.messages.course.build.failed, this.courseBuildFailed);
    }

    async downloadCourse() {
        if (this.isCourseDelivering()) {
            return;
        }

        notify.hide();
        eventTracker.publish(events.downloadCourse);

        try {
            let course = await repository.getById(this.courseId);
            let courseInfo = await course.build(this.includeMedia());
            fileHelper.downloadFile('download/' + courseInfo.build.packageUrl);
        } catch (e) {
            notify.error(e);
        }
    }

    //#region App-wide events

    courseBuildStarted(course) {
        if (course.id !== this.courseId || course.build.state !== constants.publishingStates.building) {
            return;
        }

        this.state(constants.publishingStates.building);
    }

    courseBuildFailed(course) {
        if (course.id !== this.courseId || course.build.state !== constants.publishingStates.failed) {
            return;
        }

        this.state(constants.publishingStates.failed);
        this.packageUrl('');
    }

    courseBuildCompleted(course) {
        if (course.id !== this.courseId || course.build.state !== constants.publishingStates.succeed) {
            return;
        }

        this.state(constants.publishingStates.succeed);
        this.packageUrl(course.build.packageUrl);
    }

    //#endregion
}