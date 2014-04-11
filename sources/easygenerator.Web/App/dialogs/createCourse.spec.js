define(['dialogs/createCourse'], function(Dialog) {

    var router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        appDialog = require('plugins/dialog');

    describe('dialog [createCourse]', function() {

        var ctor;

        beforeEach(function() {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(appDialog, 'close');
            ctor = new Dialog();
        });

        it('should be function', function() {
            expect(Dialog).toBeFunction();
        });

        describe('navigateToCreateCourse', function () {

            it('should be function', function() {
                expect(ctor.navigateToCreateCourse).toBeFunction();
            });

            it('should send event \'Navigate to create course\'', function () {
                ctor.navigateToCreateCourse();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create course');
            });

            it('should navigate to course/create', function () {
                ctor.navigateToCreateCourse();
                expect(router.navigate).toHaveBeenCalledWith('course/create');
            });

            it('should close dialog window', function() {
                ctor.navigateToCreateCourse();
                expect(appDialog.close).toHaveBeenCalledWith(ctor);
            });

        });

    });

});