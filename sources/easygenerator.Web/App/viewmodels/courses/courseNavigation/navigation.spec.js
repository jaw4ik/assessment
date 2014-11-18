define(['viewmodels/courses/courseNavigation/navigation'],
    function (navigation) {
        "use strict";

        var eventTracker = require('eventTracker'),
            router = require('plugins/router'),
            vmShareCourse = require('dialogs/shareCourse/shareCourse');

        describe('viewmodel [courseNavigation]', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'openUrl');
            });

            describe('items:', function () {
                it('should be array', function () {
                    expect(navigation.navigationItems).toBeArray();
                });
            });

            describe('activate:', function () {
                it('should be function', function () {
                    expect(navigation.activate).toBeFunction();
                });

                it('should fill items collection', function () {
                    navigation.activate();
                    expect(navigation.navigationItems.length).toBe(4);
                });
            });

            describe('previewCourse', function () {
                it('should be function', function () {
                    expect(navigation.previewCourse).toBeFunction();
                });

                it('should send \'Preview course\' event', function () {
                    navigation.previewCourse();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Preview course');
                });

                it('should open url', function () {
                    var courseId = 'courseId';
                    router.routeData({
                        courseId: courseId
                    });

                    navigation.previewCourse();
                    expect(router.openUrl).toHaveBeenCalledWith('/preview/' + courseId);
                });
            });

            describe('shareCourse:', function () {
                beforeEach(function() {
                    spyOn(vmShareCourse, 'show');
                });

                it('should be function', function () {
                    expect(navigation.shareCourse).toBeFunction();
                });

                it('should set vm share course visible to true', function () {
                    navigation.shareCourse();
                    expect(vmShareCourse.show).toHaveBeenCalled();
                });
            });

            describe('coursePreviewLink:', function () {
                it('should be computed', function () {
                    expect(navigation.coursePreviewLink).toBeComputed();
                });

                it('should be \'/preview/\' + courseId', function () {
                    var courseId = 'courseId';
                    router.routeData({
                        courseId: courseId
                    });

                    expect(navigation.coursePreviewLink()).toBe('/preview/' + courseId);
                });
            });
        });
    });