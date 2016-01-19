import ko from 'knockout';
import app from 'durandal/app';
import constants from 'constants';
import router from 'plugins/router';
import eventTracker from 'eventTracker';

export default class {
    constructor(course) {
        this.id = course.id;
        this.title = ko.observable(course.title);
        this.modifiedOn = ko.observable(course.modifiedOn);
        this.thumbnail = ko.observable(course.template.thumbnail);
        this.preview = () => {
            eventTracker.publish('Preview course');
            router.openUrl(`/preview/${this.id}`);
        }
        this.remove = () => {
            app.trigger(constants.messages.learningPath.removeCourse, this.id);
        }
    }
}