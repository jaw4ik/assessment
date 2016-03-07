import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';
import app from 'durandal/app';
import router from 'plugins/router';
import courseComments from 'review/comments/courseComments';
import coursePublish from 'review/publish/coursePublish';
import eventTracker from 'eventTracker';

let _modalViewOpenedHandlers = new WeakMap();

let events = {
    openReviewTab: 'Open review tab'
};

class ReviewPanel {
    constructor() {
        this.isExpanded = ko.observable(false);
        this.isVisible = ko.computed(() => !_.isNullOrUndefined(router.routeData().courseId));
        this.routeCourseId = ko.computed(() => router.routeData().courseId);

        this.courseId = null;
        this.courseComments = courseComments;
        this.coursePublish = coursePublish;
        this._routerNavigatedProxy = this.routerNavigated.bind(this);
        this.isModalViewShown = ko.observable(false);

        _modalViewOpenedHandlers.set(this, (isOpenedinPopup) => {
            this.isModalViewShown(isOpenedinPopup);
        });

        app.on('modal-view:visibility-state-changed', _modalViewOpenedHandlers.get(this).bind(this));    
    }

    toggleIsExpanded(){
        if (this.isExpanded()) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    routerNavigated() {
        if (!this.isVisible() || (this.isVisible() && this.courseId !== this.routeCourseId())) {
            this.collapse();
        }
    }

    expand(){
        eventTracker.publish(events.openReviewTab);
        this.isExpanded(true);

        this.courseId = this.routeCourseId();
        this.courseComments.initialize(this.courseId);
        this.coursePublish.initialize(this.courseId);

        app.trigger(constants.messages.sidePanel.expanded);
        router.on('router:navigation:composition-complete', this._routerNavigatedProxy);
    }

    collapse() {
        this.isExpanded(false);

        this.courseId = null;
        this.courseComments.tearDown();

        app.trigger(constants.messages.sidePanel.collapsed);
        router.off('router:navigation:composition-complete', this._routerNavigatedProxy);
    }
}

export default new ReviewPanel();