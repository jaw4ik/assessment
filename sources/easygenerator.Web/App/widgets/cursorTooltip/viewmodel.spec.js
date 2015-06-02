define(['widgets/cursorTooltip/viewmodel'], function (widget) {
    'use strict';

    var cursorTooltipBindingHandler = require('widgets/cursorTooltip/bindingHadlers/cursorTooltipBindingHandler');

    describe('widget cursorTooltip:', function () {

        describe('isVisible', function () {

            it('should be observable', function() {
                expect(widget.isVisible).toBeObservable();
            });

        });

        describe('text:', function() {

            it('should be observable', function() {
                expect(widget.text).toBeObservable();
            });

        });

        describe('activate:', function() {

            beforeEach(function() {
                spyOn(cursorTooltipBindingHandler, 'install');
            });

            it('should be function', function() {
                expect(widget.activate).toBeFunction();
            });

            it('should initialize tooltip binding', function() {
                widget.activate();
                expect(cursorTooltipBindingHandler.install).toHaveBeenCalled();
            });

        });

        describe('show:', function() {

            it('should be function', function() {
                expect(widget.show).toBeFunction();
            });

            it('should show cursor tooltip', function() {
                widget.isVisible(false);
                widget.show();
                expect(widget.isVisible()).toBeTruthy();
            });

        });

        describe('hide:', function() {

            it('should be function', function() {
                expect(widget.hide).toBeFunction();
            });

            it('should hide cursor tooltip', function() {
                widget.isVisible(true);
                widget.hide();
                expect(widget.isVisible()).toBeFalsy();
            });

        });

        describe('changeText:', function () {

            it('should be function', function() {
                expect(widget.changeText).toBeFunction();
            });

        });

    });

});