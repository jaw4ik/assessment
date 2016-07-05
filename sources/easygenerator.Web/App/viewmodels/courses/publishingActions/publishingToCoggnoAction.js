import constants from 'constants';
import app from 'durandal/app';
import _ from 'underscore';
import binder from 'binder';
import ko from 'knockout';

export default class {
    constructor() {
        binder.bindClass(this);

        this.state = ko.observable();
        this.packageUrl = ko.observable();
        this.states = constants.publishingStates;
        this.isCourseDelivering = ko.observable(false);
        this.courseId = '';
        this.subscriptions = [];
        this.packageExists = ko.computed(() => !_.isNullOrUndefined(this.packageUrl()) && !_.isEmptyOrWhitespace(this.packageUrl()), this);
    }

    activate(course, action) {
        this.state(action.state);
        this.packageUrl(action.packageUrl);
        this.isCourseDelivering(course.isDelivering);
        this.courseId = course.id;

        this.clearSubscriptions();
        
        this.subscribe(constants.messages.course.delivering.started, this.courseDeliveringStarted);
        this.subscribe(constants.messages.course.delivering.finished, this.courseDeliveringFinished);
    }

    deactivate() {
        _.each(this.subscriptions, subscription => subscription.off());
        this.clearSubscriptions();
    }

    subscribe(eventName, handler) {
        this.subscriptions.push(app.on(eventName).then(handler));
    }

    clearSubscriptions() {
        this.subscriptions.splice(0, this.subscriptions.length);
    }

    //#region App-wide events

    courseDeliveringStarted(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.isCourseDelivering(true);
    }

    courseDeliveringFinished(course) {
        if (course.id !== this.courseId) {
            return;
        }

        this.isCourseDelivering(false);
    }

//#endregion
}