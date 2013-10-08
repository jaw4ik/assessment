define(['jquery', 'notify'], function ($, notify) {
    "use strict";

    describe('[notify]', function () {

        it('should be object', function () {
            expect(notify).toBeObject();
        });

        describe('isShownMessage:', function () {
            it('should be observable', function () {
                expect(notify.isShownMessage).toBeObservable();
            });
        });

        describe('info:', function () {

            beforeEach(function () {
                var container = $('.notification-container');
                if (!container.length) {
                    container = $('<div>').addClass('notification-container').appendTo(document.body);
                }
                container.empty();
            });

            it('should be function', function () {
                expect(notify.info).toBeFunction();
            });

            describe('when isShownMessage is true', function () {

                beforeEach(function () {
                    notify.isShownMessage(true);
                });
                
                it('should display info message', function () {
                    notify.info('test info message');
                    var notification = $('.notification');
                    expect(notification.length).not.toBe(0);
                });
            });
            
            describe('when isShownMessage is false', function () {
                beforeEach(function () {
                    notify.isShownMessage(false);
                });
                
                it('should not display info message', function () {
                    notify.info('test info message');
                    var notification = $('.notification');
                    expect(notification.length).toBe(0);
                });
            });
        });

        describe('error:', function () {
            
            beforeEach(function () {
                var container = $('.notification-container');
                if (!container.length) {
                    container = $('<div>').addClass('notification-container').appendTo(document.body);
                }
                container.empty();
            });

            it('should be function', function () {
                expect(notify.error).toBeFunction();
            });
            
            describe('when isShownMessage is true', function () {

                beforeEach(function () {
                    notify.isShownMessage(true);
                });

                it('should display error message', function () {
                    notify.error('test error message');
                    var notification = $('.notification');
                    expect(notification.length).not.toBe(0);
                });
            });

            describe('when isShownMessage is false', function () {
                beforeEach(function () {
                    notify.isShownMessage(false);
                });

                it('should not display error message', function () {
                    notify.error('test error message');
                    var notification = $('.notification');
                    expect(notification.length).toBe(0);
                });
            });
        });

        describe('lockContent:', function () {
            it('should be function', function () {
                expect(notify.lockContent).toBeFunction();
            });
        });

        describe('unlockContent:', function () {
            it('should be function', function () {
                expect(notify.unlockContent).toBeFunction();
            });
        });

        describe('hide:', function () {
            it('should be function', function () {
                expect(notify.hide).toBeFunction();
            });
        });
    });

});