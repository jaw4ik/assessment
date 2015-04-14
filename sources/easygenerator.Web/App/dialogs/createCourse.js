define(['plugins/router', 'plugins/dialog', 'commands/createCourseCommand', 'commands/presentationCourseImportCommand'],
    function (router, dialog, createCourseCommand, presentationCourseImportCommand) {
        "use strict";

        var eventCategory = 'Splash pop-up after signup';

        var createCourse = function () {
            var self = this;
            self.isCourseCreating = ko.observable(false);
            self.isCourseImporting = ko.observable(false);
            self.isProcessing = ko.computed(function () {
                return self.isCourseCreating() || self.isCourseImporting();
            });
        };

        createCourse.prototype.createNewCourse = function () {
            var that = this;

            if (that.isProcessing()) {
                return;
            }

            that.isCourseCreating(true);
            return createCourseCommand.execute(eventCategory)
                .then(function (course) {
                    router.navigate('#courses/' + course.id);
                    dialog.close(that);
                })
                .fin(function () {
                    that.isCourseCreating(false);
                });
        };

        createCourse.prototype.importCourseFromPresentation = function () {
            var that = this;

            if (that.isProcessing()) {
                return;
            }

            return presentationCourseImportCommand.execute({
                startLoading: function () {
                    that.isCourseImporting(true);
                },
                success: function (course) {
                    if (course.objectives.length) {
                        router.navigate('#courses/' + course.id + '/objectives/' + course.objectives[0].id);
                    } else {
                        router.navigate('#courses/' + course.id);
                    }

                    dialog.close(that);
                },
                complete: function () {
                    that.isCourseImporting(false);
                },
                eventCategory: eventCategory
            });
        };

        return createCourse;
    });