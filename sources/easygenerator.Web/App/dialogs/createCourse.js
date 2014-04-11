define(['eventTracker', 'plugins/router', 'plugins/dialog'], function (eventTracker, router, dialog) {
    "use strict";

    var events = {
        navigateToCreateCourse: 'Navigate to create course'
    };

    var createCourse = function() { };

    createCourse.prototype.navigateToCreateCourse = function() {
        eventTracker.publish(events.navigateToCreateCourse);
        router.navigate('course/create');
        dialog.close(this);
    };

    return createCourse;
});