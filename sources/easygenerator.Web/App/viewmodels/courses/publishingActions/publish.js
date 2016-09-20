import constants from 'constants';
import notify from 'notify';
import eventTracker from 'eventTracker';
import router from 'routing/router';
import clientContext from 'clientContext';
import repository from 'repositories/courseRepository';
import _ from 'underscore';
import ko from 'knockout';
import PublishingAction from './publishingAction';
import UsersAccessControlListViewModel from './components/usersAccessControlList';

const events = {
    publishCourse: 'Publish course',
    copyEmbedCode: 'Copy embed code',
    copyPublishLink: 'Copy publish link'
};

export default class extends PublishingAction {
    constructor(eventCategory) {
        super();

        this.eventCategory = eventCategory;
        this.isPublishing = ko.computed(() => this.state() === constants.publishingStates.building || this.state() === constants.publishingStates.publishing, this);
        this.courseIsDirty = ko.observable();
        this.frameWidth = ko.observable(_.isNullOrUndefined(clientContext.get(constants.frameSize.width.name)) ? constants.frameSize.width.value : clientContext.get(constants.frameSize.width.name));
        this.frameHeight = ko.observable(_.isNullOrUndefined(clientContext.get(constants.frameSize.height.name)) ? constants.frameSize.height.value : clientContext.get(constants.frameSize.height.name));
        this.embedCode = ko.observable();
        this.linkCopied = ko.observable(false);
        this.embedCodeCopied = ko.observable(false);
        this.copyBtnDisabled = ko.observable(false);
        this.subscriptions = [];
        this.embedCode = ko.computed({
            read: () => {
                clientContext.set(constants.frameSize.width.name, this.frameWidth());
                clientContext.set(constants.frameSize.height.name, this.frameHeight());
                return this.getEmbedCode();
            },
            write: () => {}
        }, this);
        this.usersAccessControlListViewModel = new UsersAccessControlListViewModel();
    }

    async activate(courseId) {
        let course = await repository.getById(courseId);
        
        super.activate(course, course.publish);

        this.courseIsDirty(course.isDirty);
        this.linkCopied(false);
        this.embedCodeCopied(false);
        this.copyBtnDisabled(false);

        this.subscribe(constants.messages.course.build.started, this.courseBuildStarted);
        this.subscribe(constants.messages.course.build.failed, this.courseBuildFailed);

        this.subscribe(constants.messages.course.publish.started, this.coursePublishStarted);
        this.subscribe(constants.messages.course.publish.completed, this.coursePublishCompleted);
        this.subscribe(constants.messages.course.publish.failed, this.coursePublishFailed);
        this.subscribe(constants.messages.course.stateChanged + courseId, this.courseStateChanged);
    }

    validateFrameWidth() {
        if (!this.frameWidth() || this.frameWidth() == 0) {
            this.frameWidth(constants.frameSize.width.value);
        }
    }

    validateFrameHeight() {
        if (!this.frameHeight() || this.frameHeight() == 0) {
            this.frameHeight(constants.frameSize.height.value);
        }
    }

    copyLinkToClipboard() {
        eventTracker.publish(events.copyPublishLink, this.eventCategory);
        this.copyToClipboard(this.linkCopied);
    }

    copyEmbedCodeToClipboard() {
        eventTracker.publish(events.copyEmbedCode, this.eventCategory);
        this.copyToClipboard(this.embedCodeCopied);
    }

    copyToClipboard(value) {
        value(true);
        _.delay(() => value(false), constants.copyToClipboardWait);
    }

    getEmbedCode() {
        return constants.embedCode.replace('{W}', this.frameWidth()).replace('{H}', this.frameHeight()).replace('{src}', this.packageUrl());
    }

    async publishCourse() {
        if (this.isCourseDelivering()) {
            return;
        }

        eventTracker.publish(events.publishCourse, this.eventCategory);

        try {
            let course = await repository.getById(this.courseId);
            await course.publish();
        } catch (e) {
            notify.error(e);
        }
    }

    openPublishedCourse() {
        if (this.packageExists()) {
            router.openUrl(this.packageUrl());
        }
    }

    //#region App-wide events

    courseStateChanged(state) {
        this.courseIsDirty(state.isDirty);
    }

    courseBuildStarted(course) {
        if (course.id !== this.courseId || course.publish.state !== constants.publishingStates.building) {
            return;
        }

        this.state(constants.publishingStates.building);
    }

    courseBuildFailed(course) {
        if (course.id !== this.courseId || course.publish.state !== constants.publishingStates.failed) {
            return;
        }

        this.state(constants.publishingStates.failed);
        this.packageUrl('');
        this.embedCode('');
    }

    coursePublishStarted(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.state(constants.publishingStates.publishing);
    }

    coursePublishCompleted(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.state(constants.publishingStates.succeed);
        this.packageUrl(course.publish.packageUrl);
        this.embedCode(this.getEmbedCode());
    }

    coursePublishFailed(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.state(constants.publishingStates.failed);
        this.packageUrl('');
    }

    //#endregion
}