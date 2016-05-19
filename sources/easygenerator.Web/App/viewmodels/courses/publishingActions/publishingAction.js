import constants from 'constants';
import app from 'durandal/app';
import _ from 'underscore';
import binder from 'binder';
import ko from 'knockout';
import http from 'http/apiHttpWrapper';
import userContext from 'userContext';

export default class {
    constructor() {
        binder.bindClass(this);

        this.state = ko.observable();
        this.packageUrl = ko.observable();
        this.states = constants.publishingStates;
        this.isCourseDelivering = ko.observable(false);
        this.includeMedia = ko.observable(userContext.identity ? userContext.identity.includeMediaToPackage : false);
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
        this.subscribe(constants.messages.includeMedia.modeChanged, this.includeMediaModeChangedEvent);
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

    async includeMediaModeChanged(newValue) {
        await http.post('api/user/switchincludemedia');
        userContext.identity.includeMediaToPackage = newValue;
        app.trigger(constants.messages.includeMedia.modeChanged, newValue);
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

    includeMediaModeChangedEvent(newValue) {
        if (this.includeMedia() === newValue) {
            return;
        }

        this.includeMedia(newValue);
    }

    //#endregion
}