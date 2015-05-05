define(['widgets/notifyViewer/viewmodel'], function (viewModel) {
    "use strict";

    var 
        app = require('durandal/app'),
        constants = require('constants');

    describe('viewmodel [notifyViewer]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('notifications:', function () {

            it('should be observable array', function() {
                expect(viewModel.notifications).toBeObservableArray();
            });

        });

        describe('enabled:', function () {

            it('should be observable', function () {
                expect(viewModel.enabled).toBeObservable();
            });

        });

        describe('moved:', function () {

            it('should be observable', function () {
                expect(viewModel.moved).toBeObservable();
            });

        });

        describe('addNotice:', function () {

            it('should be function', function () {
                expect(viewModel.addNotice).toBeFunction();
            });

            beforeEach(function () {
                spyOn($.fn, 'hide').and.returnValue($.fn);
                spyOn($.fn, 'fadeIn').and.returnValue($.fn);
                spyOn($.fn, 'delay').and.returnValue($.fn);
                spyOn($.fn, 'fadeOut').and.returnValue($.fn);
                spyOn($.fn, 'remove').and.returnValue($.fn);
            });

            var notice = { nodeType: null };

            describe('when node type is not 1', function () {

                beforeEach(function() {
                    notice.nodeType = 0;
                });

                it('should not show notice', function () {
                    viewModel.addNotice(notice);
                    expect($.fn.hide).not.toHaveBeenCalled();
                    expect($.fn.fadeIn).not.toHaveBeenCalled();
                });

            });

            describe('when node type is 1', function () {

                beforeEach(function () {
                    notice.nodeType = 1;
                });

                it('should hide notice', function () {

                    viewModel.addNotice(notice);

                    expect($.fn.hide).toHaveBeenCalled();
                });

                it('should fade in item', function () {
                    viewModel.addNotice(notice);

                    expect($.fn.fadeIn).toHaveBeenCalled();
                });

                it('should fade out in 7 seconds', function () {
                    jasmine.clock().install();

                    viewModel.addNotice(notice);
                    jasmine.clock().tick(8000);

                    expect($.fn.fadeOut).toHaveBeenCalled();

                    jasmine.clock().uninstall();
                });

            });

        });

    });

});