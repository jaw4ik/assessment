import constants from 'constants';
import notify from 'notify';
import eventTracker from 'eventTracker';
import repository from 'repositories/courseRepository';
import _ from 'underscore';
import ko from 'knockout';
import userContext from 'userContext';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import allowCoggnoDialog from 'widgets/allowCoggno/viewmodel';
import localizationManager from 'localization/localizationManager';
import PublishingToCoggnoAction from './publishingToCoggnoAction';

const events = {
    publishCourse: 'Publish course to Coggno'
};

const courseProcessingFailedMessage = localizationManager.localize('courseProcessingFailed');

export default class extends PublishingToCoggnoAction {
    constructor() {
        super();

        this.coggnoServiceUrl = constants.coggno.serviceUrl;
        this.coggnoServiceProviderUrl = constants.coggno.serviceProviderUrl;
        this.isPublishing = ko.computed(() => this.state() === constants.publishingStates.building || this.state() === constants.publishingStates.publishing, this);
        this.isProcessing = ko.observable();
        this.courseIsDirty = ko.observable();
        this.isCourseOwn = ko.observable();
        this.publicationUrl = ko.observable();
        this.subscriptions = [];
    }

    async activate(courseId) {
        var course = await repository.getById(courseId);
        
        super.activate(course, course.publishToCoggno);

        this.courseIsDirty(course.isDirtyForSale);
        this.isProcessing(course.saleInfo.isProcessing);
        this.isCourseOwn(course.createdBy === userContext.identity.email);
        this.publicationUrl(`${this.coggnoServiceProviderUrl}?uid=${courseId}`);

        this.subscribe(constants.messages.course.scormBuild.started, this.courseBuildStarted);
        this.subscribe(constants.messages.course.scormBuild.failed, this.courseBuildFailed);

        this.subscribe(constants.messages.course.publishToCoggno.started, this.coursePublishStarted);
        this.subscribe(constants.messages.course.publishToCoggno.completed, this.coursePublishCompleted);
        this.subscribe(constants.messages.course.publishToCoggno.failed, this.coursePublishFailed);
        this.subscribe(constants.messages.course.publishToCoggno.processed, this.courseProcessed);
        this.subscribe(constants.messages.course.stateChanged + courseId, this.courseStateChanged);
    }

    isPublicationAllowed() {
        return (this.isCourseOwn() || this.packageExists()) && !this.isCourseDelivering() && !this.isProcessing();
    }

    publishCourse() {
        if (!userContext.hasPlusAccess()) {
            upgradeDialog.show(constants.dialogs.upgrade.settings.publishToCoggno);
            return;
        }
        if (!this.isPublicationAllowed()) {
            return;
        }
        if (!userContext.identity.isCoggnoSamlServiceProviderAllowed) {
            allowCoggnoDialog.show(this.doPublishCourse);
            return;
        }
        this.doPublishCourse();
    }

    async doPublishCourse() {
        eventTracker.publish(events.publishCourse);
        try {
            let course = await repository.getById(this.courseId);
            await course.publishToCoggno();
            course.saleInfo.isProcessing = true;
            this.isProcessing(true);
        } catch (e) {
            notify.error(e);
        }
    }

    //#region App-wide events

    courseStateChanged(state) {
        this.courseIsDirty(state.isDirtyForSale);
    }

    courseBuildStarted(course) {
        if (course.id !== this.courseId || course.publishToCoggno.state !== constants.publishingStates.building) {
            return;
        }

        this.state(constants.publishingStates.building);
    }

    courseBuildFailed(course) {
        if (course.id !== this.courseId || course.publishToCoggno.state !== constants.publishingStates.failed) {
            return;
        }

        this.state(constants.publishingStates.failed);
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

        this.isProcessing(course.saleInfo.isProcessing);
        this.state(constants.publishingStates.succeed);
    }

    coursePublishFailed(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.state(constants.publishingStates.failed);
    }

    courseProcessed(course, success) {
        if (course.id !== this.courseId) {
            return;
        }
        this.isProcessing(course.saleInfo.isProcessing);
        this.packageUrl(course.publishToCoggno.packageUrl);
        if (!success) {
            notify.error(courseProcessingFailedMessage);
        }
    }

    //#endregion
}