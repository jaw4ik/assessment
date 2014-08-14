define(['plugins/router', 'plugins/dialog', 'commands/createCourseCommand'], function (router, dialog, createCourseCommand) {
    "use strict";

    var createCourse = function() {
        this.isCourseCreating = ko.observable(false);
    };

    createCourse.prototype.createNewCourse = function () {
        this.isCourseCreating(true);

        var that = this;
        return createCourseCommand.execute('Splash pop-up after signup')
            .then(function(course) {
                router.navigate('#course/' + course.id);
                dialog.close(that);
            })
            .fin(function() {
                that.isCourseCreating(false);
            });
    };

    return createCourse;
});