define(['notify'], function (notify) {
    "use strict";

    var
        localizationManager = require('localization/localizationManager'),
        notifyViewer = require('widgets/notifyViewer/viewmodel');

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

                expect(notifyViewer.notifications()[0]).toEqual({ text: "success message", type: "success" });
            });

            it('should remove all notifications except just created', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);

                notify.success("success message");

                expect(notifyViewer.notifications().length).toBe(1);
                expect(notifyViewer.notifications()[0].text).toBe("success message");
            });

        });

        describe('info:', function () {

            it('should be function', function () {
                expect(notify.info).toBeFunction();
            });

            it('should add info type notification', function () {
                notifyViewer.notifications([]);

                notify.info("message");

                expect(notifyViewer.notifications()[0]).toEqual({ text: "message", type: "info" });
            });

            it('should remove all notifications except just created', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);

                notify.info("message");

                expect(notifyViewer.notifications().length).toBe(1);
                expect(notifyViewer.notifications()[0].text).toBe("message");
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
                spyOn(localizationManager, 'localize').and.returnValue("saved message");

                notifyViewer.notifications([]);
                notify.saved();

                expect(notifyViewer.notifications()[0]).toEqual({ text: "saved message", type: "success" });
            });

            it('should remove all notifications except just created', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);

                notify.saved();

                expect(notifyViewer.notifications().length).toBe(1);
                expect(notifyViewer.notifications()[0].text).toBe(localizationManager.localize('allChangesAreSaved'));
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

    });

});