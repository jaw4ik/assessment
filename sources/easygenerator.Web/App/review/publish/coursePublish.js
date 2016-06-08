import _ from 'underscore';
import ko from 'knockout';
import app from 'durandal/app';
import router from 'routing/router';
import constants from 'constants';
import repository from 'repositories/courseRepository';
import eventTracker from 'eventTracker';
import notify from 'notify';

var events = {
    updateCourseForReview: 'Update course for review'
};

class CoursePublish{
    constructor() {
        this.states = constants.publishingStates;
        this.courseId = null;
        this.reviewUrl = ko.observable();
        this.state = ko.observable();
        this.isActive = ko.observable(false);

        this.isPublishing = ko.computed(() => {
            return this.state() === constants.publishingStates.building || this.state() === constants.publishingStates.publishing;
        });

        this.reviewUrlExists = ko.computed(() => {
            return !_.isNullOrUndefined(this.reviewUrl()) && !_.isEmptyOrWhitespace(this.reviewUrl());
        });
        
        app.on(constants.messages.course.build.started).then(this.courseBuildStarted.bind(this));
        app.on(constants.messages.course.build.failed).then(this.courseBuildFailed.bind(this));
        app.on(constants.messages.course.publishForReview.started).then(this.coursePublishForReviewStarted.bind(this));
        app.on(constants.messages.course.publishForReview.completed).then(this.coursePublishForReviewCompleted.bind(this));
        app.on(constants.messages.course.publishForReview.failed).then(this.coursePublishForReviewFailed.bind(this));
    }

    openCourseReviewUrl() {
        if (this.reviewUrlExists() && !this.isPublishing()) {
            router.openUrl(this.reviewUrl());
        }
    }

    updateCourseForReview() {
        if (this.isActive())
            return undefined;

        this.isActive(true);

        eventTracker.publish(events.updateCourseForReview);

        return repository.getById(this.courseId).then(course => {
            return course.publishForReview().fail(message => {
                notify.error(message);
            }).fin(() => {
                this.isActive(false);
            });
        });
    }

    initialize(courseId) {
        return repository.getById(courseId).then(course => {
            this.courseId = course.id;
            this.reviewUrl(course.publishForReview.packageUrl);
            this.state(this.reviewUrlExists() ? constants.publishingStates.succeed : constants.publishingStates.failed);
        });
    }

    //#region App-wide events

    courseBuildStarted(course) {
        if (course.id !== this.courseId || course.publishForReview.state !== constants.publishingStates.building)
            return;

        this.state(constants.publishingStates.building);
    }

    courseBuildFailed(course) {
        if (course.id !== this.courseId || course.publishForReview.state !== constants.publishingStates.failed)
            return;

        this.state(constants.publishingStates.failed);
    }

    coursePublishForReviewStarted(course) {
        if (course.id !== this.courseId)
            return;

        this.state(constants.publishingStates.publishing);
    }

    coursePublishForReviewCompleted(course) {
        if (course.id !== this.courseId)
            return;

        this.state(constants.publishingStates.succeed);
        this.reviewUrl(course.publishForReview.packageUrl);
    }

    coursePublishForReviewFailed(course) {
        if (course.id !== this.courseId)
            return;

        this.state(constants.publishingStates.failed);
    }

    //#endregion
}

export default new CoursePublish();