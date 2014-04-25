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
            var timerCallback;

            beforeEach(function() {
                timerCallback = jasmine.createSpy("timerCallback");
                jasmine.clock().install();
            });

            afterEach(function() {
                  jasmine.clock().uninstall();
            });

            it('should be function', function () {
                expect(notify.success).toBeFunction();
            });

            it('should add info type notification', function () {
                notifyViewer.notifications([]);

                notify.success("success message");

                expect(notifyViewer.notifications()[0]).toEqual({ text: "success message", type: "success" });
            });

            it('should remove notification after 5 seconds', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);

                notify.success("success message");

                jasmine.clock().tick(6000);

                expect(notifyViewer.notifications().length).toBe(2);
                expect(notifyViewer.notifications()[0].text).toBe("text1");
                expect(notifyViewer.notifications()[1].text).toBe("text2");
            });

        });

        describe('info:', function () {
            var timerCallback;

            beforeEach(function () {
                timerCallback = jasmine.createSpy("timerCallback");
                jasmine.clock().install();
            });

            afterEach(function () {
                jasmine.clock().uninstall();
            });

            it('should be function', function () {
                expect(notify.info).toBeFunction();
            });

            it('should add info type notification', function () {
                notifyViewer.notifications([]);

                notify.info("message");

                expect(notifyViewer.notifications()[0]).toEqual({ text: "message", type: "info" });
            });

            it('should remove notification after 5 seconds', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);

                notify.info("message");

                jasmine.clock().tick(6000);

                expect(notifyViewer.notifications().length).toBe(2);
                expect(notifyViewer.notifications()[0].text).toBe("text1");
                expect(notifyViewer.notifications()[1].text).toBe("text2");
            });

        });

        describe('error:', function () {
            var timerCallback;

            beforeEach(function () {
                timerCallback = jasmine.createSpy("timerCallback");
                jasmine.clock().install();
            });

            afterEach(function () {
                jasmine.clock().uninstall();
            });

            it('should be function', function () {
                expect(notify.error).toBeFunction();
            });

            it('should add error type notification', function () {
                notifyViewer.notifications([]);

                notify.error("error message");

                expect(_.isEqual(notifyViewer.notifications()[0], { text: "error message", type: "error" })).toBeTruthy();
            });

            it('should remove notification after 5 seconds', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);

                notify.error("error message");

                jasmine.clock().tick(6000);

                expect(notifyViewer.notifications().length).toBe(2);
                expect(notifyViewer.notifications()[0].text).toBe("text1");
                expect(notifyViewer.notifications()[1].text).toBe("text2");
            });

        });

        describe('saved:', function () {
            var timerCallback;

            beforeEach(function () {
                timerCallback = jasmine.createSpy("timerCallback");
                jasmine.clock().install();
            });

            afterEach(function () {
                jasmine.clock().uninstall();
            });

            it('should be function', function () {
                expect(notify.saved).toBeFunction();
            });

            it('should add info type notification', function () {
                spyOn(localizationManager, 'localize').and.returnValue("saved message");

                notifyViewer.notifications([]);
                notify.saved();

                expect(notifyViewer.notifications()[0]).toEqual({ text: "saved message", type: "success" });
            });

            it('should remove notification after 5 seconds', function () {
                notifyViewer.notifications([{ text: "text1" }, { text: "text2" }]);

                notify.saved();

                jasmine.clock().tick(6000);

                expect(notifyViewer.notifications().length).toBe(2);
                expect(notifyViewer.notifications()[0].text).toBe("text1");
                expect(notifyViewer.notifications()[1].text).toBe("text2");
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