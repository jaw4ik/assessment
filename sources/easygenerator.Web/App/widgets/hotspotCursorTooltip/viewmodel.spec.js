define(['widgets/hotspotCursorTooltip/viewmodel'], function(widget) {
    'use strict';

    var hotspotCursorTooltipBindingHandler = require('widgets/hotspotCursorTooltip/bindingHadlers/hotspotCursorTooltipBindingHandler'),
        localizationManager = require('localization/localizationManager');

    describe('widget hotspotCursorTooltip:', function () {

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
                spyOn(hotspotCursorTooltipBindingHandler, 'install');
            });

            it('should be function', function() {
                expect(widget.activate).toBeFunction();
            });

            it('should initialize tooltip binding', function() {
                widget.activate();
                expect(hotspotCursorTooltipBindingHandler.install).toHaveBeenCalled();
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