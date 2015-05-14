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

            it('should remove all previous info notifications with the same text', function() {
                notifyViewer.notifications([{ text: "message", type: "info" }, { text: "message", type: "error" }, { text: "message1", type: "info" }]);

                notify.info("message");

                expect(notifyViewer.notifications().length).toBe(3);
                expect(notifyViewer.notifications()[0]).toEqual({ text: "message", type: "error" });
                expect(notifyViewer.notifications()[1]).toEqual({ text: "message1", type: "info" });
                expect(notifyViewer.notifications()[2]).toEqual({ text: "message", type: "info" });
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

            it('should remove all previous error notifications with the same text', function () {
                notifyViewer.notifications([{ text: "error message", type: "info" }, { text: "error message", type: "error" }, { text: "error message1", type: "error" }]);

                notify.error("error message");

                expect(notifyViewer.notifications().length).toBe(3);
                expect(notifyViewer.notifications()[0]).toEqual({ text: "error message", type: "info" });
                expect(notifyViewer.notifications()[1]).toEqual({ text: "error message1", type: "error" });
                expect(notifyViewer.notifications()[2]).toEqual({ text: "error message", type: "error" });
            });
        });

        describe('saved:', function () {

            beforeEach(function() {
                spyOn(localizationManager, 'localize').and.returnValue("saved message");
            });

            it('should be function', function () {
                expect(notify.saved).toBeFunction();
            });

            it('should add info type notification', function () {
                notifyViewer.notifications([]);
                notify.saved();

                expect(notifyViewer.notifications()[0]).toEqual({ text: "saved message", type: "success" });
            });

            it('should remove all previous saved notifications', function () {
                notifyViewer.notifications([{ text: "saved message", type: "success" }, { text: "saved message1", type: "success" }, { text: "error message", type: "error" }]);

                notify.saved();

                expect(notifyViewer.notifications().length).toBe(3);
                expect(notifyViewer.notifications()[0]).toEqual({ text: "saved message1", type: "success" });
                expect(notifyViewer.notifications()[1]).toEqual({ text: "error message", type: "error" });
                expect(notifyViewer.notifications()[2]).toEqual({ text: "saved message", type: "success" });
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