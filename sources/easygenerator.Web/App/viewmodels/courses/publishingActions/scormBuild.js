import constants from 'constants';
import notify from 'notify';
import eventTracker from 'eventTracker';
import router from 'plugins/router';
import fileHelper from 'fileHelper';
import userContext from 'userContext';
import repository from 'repositories/courseRepository';
import ko from 'knockout';
import PublishingAction from './publishingAction';

const events = {
    downloadScormCourse: 'Download SCORM 1.2 course'
};

export default class extends PublishingAction {
    constructor() {
        super();

        this.isPublishing = ko.computed(() => this.state() === constants.publishingStates.building, this);
    }

    async activate(courseId) {
        let course = await repository.getById(courseId);

        super.activate(course, course.scormBuild);

        this.userHasPublishAccess = userContext.hasStarterAccess();

        this.subscribe(constants.messages.course.scormBuild.started, this.scormBuildStarted);
        this.subscribe(constants.messages.course.scormBuild.completed, this.scormBuildCompleted);
        this.subscribe(constants.messages.course.scormBuild.failed, this.scormBuildFailed);
    }

    async downloadCourse() {
        if (this.isCourseDelivering()) {
            return;
        }

        eventTracker.publish(events.downloadScormCourse);

        try {
            let course = await repository.getById(this.courseId);
            let courseInfo = await course.scormBuild(this.includeMedia());
            fileHelper.downloadFile('download/' + courseInfo.scormBuild.packageUrl);
        } catch (e) {
            notify.error(e);
        }
    }

    openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.scorm);
        router.openUrl(constants.upgradeUrl);
    }

    //#region App-wide events

    scormBuildStarted(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.state(constants.publishingStates.building);
    }

    scormBuildCompleted(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.state(constants.publishingStates.succeed);
        this.packageUrl(course.scormBuild.packageUrl);
    }

    scormBuildFailed(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.state(constants.publishingStates.failed);
        this.packageUrl('');
    }

    //#endregion
}