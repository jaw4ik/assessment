define(['plugins/router', 'plugins/dialog', 'commands/createCourseCommand', 'commands/presentationCourseImportCommand'],
    function (router, dialog, createCourseCommand, presentationCourseImportCommand) {
        "use strict";

        var createCourse = function () {
            var self = this;
            self.isCourseCreating = ko.observable(false);
            self.isCourseImporting = ko.observable(false);
            self.isProcessing = ko.computed(function () {
                return self.isCourseCreating() || self.isCourseImporting();
            });
        };

        createCourse.prototype.createNewCourse = function () {
            this.isCourseCreating(true);

            var that = this;
            return createCourseCommand.execute('Splash pop-up after signup')
                .then(function (course) {
                    router.navigate('#course/' + course.id);
                    dialog.close(that);
                })
                .fin(function () {
                    that.isCourseCreating(false);
                });
        };

        createCourse.prototype.importCourseFromPresentation = function () {
            var that = this;
            return presentationCourseImportCommand.execute({
                startLoading: function () {
                    that.isCourseImporting(true);
                },
                success: function(course) {
                    if (course.objectives.length) {
                        router.navigate('#objective/' + course.objectives[0].id + '?courseId=' + course.id);
                    } else {
                        router.navigate('#course/' + course.id);
                    }
                    
                    dialog.close(that);
                },
                complete: function () {
                    that.isCourseImporting(false);
                }
            });
        };

        return createCourse;
    });