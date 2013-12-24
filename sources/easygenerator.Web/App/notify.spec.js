define(['notify', 'localization/localizationManager', 'widgets/notifyViewer/viewmodel'], function (notify, localizationManager, notifyViewer) {

    "use strict";

    describe('[notify]', function () {

        it('should be object', function () {
            expect(notify).toBeObject();
        });

        describe('success:', function () {

            it('should be function', function () {
                expect(notify.success).toBeFunction();
            });

            it('should add info type notification', function () {
                notifyViewer.notifications([]);
                notify.success("success message");
                expect(_.isEqual(notifyViewer.notifications()[0], { text: "success message", type: "success" })).toBeTruthy();
            });

            it('should remove all notifications except just created', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);
                notify.success("success message");
                expect(notifyViewer.notifications().length).toBe(1);
            });

        });

        describe('info:', function () {

            it('should be function', function () {
                expect(notify.info).toBeFunction();
            });

            it('should add info type notification', function () {
                notifyViewer.notifications([]);
                notify.info("message");
                expect(_.isEqual(notifyViewer.notifications()[0], { text: "message", type: "info" })).toBeTruthy();
            });

            it('should remove all notifications except just created', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);
                notify.info("message");
                expect(notifyViewer.notifications().length).toBe(1);
            });

        });

        describe('error:', function () {

            it('should be function', function () {
                expect(notify.error).toBeFunction();
            });

            it('should add error type notification', function () {
                notifyViewer.notifications([]);
                notify.error("error message");
                expect(_.isEqual(notifyViewer.notifications()[0], { text: "error message", type: "error" })).toBeTruthy();
            });

            it('should remove all notifications except just created', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);
                notify.error("error message");
                expect(notifyViewer.notifications().length).toBe(1);
            });

        });

        describe('saved:', function () {

            it('should be function', function () {
                expect(notify.saved).toBeFunction();
            });

            it('should add info type notification', function () {
                spyOn(localizationManager, 'localize').andReturn("saved message");
                notifyViewer.notifications([]);
                notify.saved();
                expect(_.isEqual(notifyViewer.notifications()[0], { text: "saved message", type: "success" })).toBeTruthy();
            });

            it('should remove all notifications except just created', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);
                notify.saved();
                expect(notifyViewer.notifications().length).toBe(1);
            });

        });

        describe('hide:', function () {

            it('should be function', function () {
                expect(notify.hide).toBeFunction();
            });

            it('should remove all notifications', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);
                notify.hide();
                expect(notifyViewer.notifications().length).toBe(0);
            });

        });

        describe('enable:', function () {

            it('should be function', function () {
                expect(notify.enable).toBeFunction();
            });

            it('should set enabled to true', function () {
                notifyViewer.enabled(false);
                notify.enable();
                expect(notifyViewer.enabled()).toBeTruthy();
            });

        });

        describe('disable:', function () {

            it('should be function', function () {
                expect(notify.disable).toBeFunction();
            });

            it('should set enabled to true', function () {
                notifyViewer.enabled(true);
                notify.disable();
                expect(notifyViewer.enabled()).toBeFalsy();
            });

        });

    });

});