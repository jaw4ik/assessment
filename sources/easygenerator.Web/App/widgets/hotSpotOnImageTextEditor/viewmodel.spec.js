define(['widgets/hotSpotOnImageTextEditor/viewmodel'], function (widget) {
    'use strict';

    var hotspotOnImageTextEditorBindingHandler = require('widgets/hotSpotOnImageTextEditor/bindingHadlers/hotspotOnImageTextEditorBindingHandler');

    describe('widget hotSpotOnImageTextEditor:', function () {

        describe('isVisible', function () {

            it('should be observable', function () {
                expect(widget.isVisible).toBeObservable();
            });

        });

        describe('text:', function () {

            it('should be observable', function () {
                expect(widget.text).toBeObservable();
            });

        });

        describe('top:', function () {

            it('should be observable', function () {
                expect(widget.top).toBeObservable();
            });

        });

        describe('left:', function () {

            it('should be observable', function () {
                expect(widget.left).toBeObservable();
            });

        });

        describe('activate:', function () {

            beforeEach(function () {
                spyOn(hotspotOnImageTextEditorBindingHandler, 'install');
            });

            it('should be function', function () {
                expect(widget.activate).toBeFunction();
            });

            it('should initialize tooltip binding', function () {
                widget.activate();
                expect(hotspotOnImageTextEditorBindingHandler.install).toHaveBeenCalled();
            });

        });

        describe('callback', function () {

            it('should be defined', function () {
                expect(widget.callback).toBeDefined();
            });

        });

        describe('close:', function () {

            it('should be function', function () {
                expect(widget.close).toBeFunction();
            });

            it('should close hotspot on image text editor', function () {
                widget.isVisible(true);
                widget.close();
                expect(widget.isVisible()).toBeFalsy();
            });

        });

        describe('show:', function () {

            var someText, top, left, callback;

            beforeEach(function () {
                someText = 'some text';
                top = 100;
                left = 200;
                callback = function () { };
            });

            it('should be function', function () {
                expect(widget.show).toBeFunction();
            });

            it('should show hotspot on image text editor', function () {
                widget.isVisible(false);
                widget.show();
                expect(widget.isVisible()).toBeTruthy();
            });

            it('should set initialize widget proprties', function () {
                widget.show(someText, top, left, callback);
                expect(widget.text()).toBe(someText);
                expect(widget.top()).toBe(top - 28);
                expect(widget.left()).toBe(left + 6);
                expect(widget.callback).toBe(callback);
            });

        });

    });
});