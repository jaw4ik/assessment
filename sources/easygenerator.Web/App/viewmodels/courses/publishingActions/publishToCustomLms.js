import constants from 'constants';
import notify from 'notify';
import eventTracker from 'eventTracker';
import ko from 'knockout';
import repository from 'repositories/courseRepository';
import PublishingAction from 'viewmodels/courses/publishingActions/publishingAction';

const events = {
    publishToCustomLms: 'Publish course to custom hosting'
};

export default class extends PublishingAction {
    constructor(eventCategory) {
        super();

        this.companyInfo = null;
        this.eventCategory = eventCategory;

        this.isDirty = ko.observable();
        this.isPublishingToLms = ko.observable(false);
        this.isPublished = ko.observable(false);
        this.isPublishing = ko.computed(() => this.isCourseDelivering() || this.isPublishingToLms(), this);
    }

    async activate(publishData) {
        let course = await repository.getById(publishData.courseId);
        
        super.activate(course, course.publish);

        this.companyInfo = publishData.companyInfo;
        this.courseId = course.id;
        this.isPublished(!!course.courseCompanies.find(company => company.id === this.companyInfo.id));
        this.isDirty(course.isDirty);

        this.subscribe(constants.messages.course.stateChanged + course.id, this.courseStateChanged);
        this.subscribe(constants.messages.course.publishToCustomLms.started, this.coursePublishStarted);
        this.subscribe(constants.messages.course.publishToCustomLms.completed, this.coursePublishCompleted);
        this.subscribe(constants.messages.course.publishToCustomLms.failed, this.coursePublishFailed);
    }

    async publishCourse() {
        if (this.packageExists() && !this.isDirty()) {
            return;
        }

        try {
            let course = await repository.getById(this.courseId);
            await course.publish();
        } catch (e) {
            notify.error(e);
        }
    }

    async publishToCustomLms() {
        eventTracker.publish(events.publishToCustomLms, this.eventCategory);

        await this.publishCourse();

        if (this.isPublished()) {
            return;
        }

        try {
            let course = await repository.getById(this.courseId);
            await course.publishToCustomLms(this.companyInfo.id);
        } catch (e) {
            notify.error(e);
        }
    }

    //#region App-wide events

    courseStateChanged(state) {
        this.isDirty(state.isDirty);
    }

    coursePublishStarted(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.isPublishingToLms(true);
    }

    coursePublishCompleted(course) {
        if (course.id !== this.courseId) {
            return;
        }
                
        this.isPublishingToLms(false);

        if (course.courseCompanies.find(company => company.id === this.companyInfo.id)) {
            this.isPublished(true);
        }
    }

    coursePublishFailed(course, message) {
        if (course.id !== this.courseId) {
            return;
        }

        this.isPublishingToLms(false);
        notify.error(message);
    }

    //#endregion
}