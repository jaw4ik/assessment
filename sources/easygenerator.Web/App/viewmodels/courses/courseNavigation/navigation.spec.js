define(['viewmodels/courses/courseNavigation/navigation'],
    function (navigation) {
        "use strict";

        var eventTracker = require('eventTracker');
        var router = require('plugins/router');

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
                    expect(navigation.navigationItems.length).toBe(3);
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
        });
    });