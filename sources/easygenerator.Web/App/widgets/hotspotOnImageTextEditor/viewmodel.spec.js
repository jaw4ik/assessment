import widget from './viewmodel';

import hotspotOnImageTextEditorBindingHandler from './bindingHadlers/hotspotOnImageTextEditorBindingHandler';

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

    describe('points:', function () {

        it('should be observable', function () {
            expect(widget.points).toBeObservable();
        });

    });

    describe('wrapper:', function () {

        it('should be observable', function () {
            expect(widget.wrapper).toBeObservable();
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

    describe('save', function() {

        it('should be function', function() {
            expect(widget.save).toBeFunction();
        });

        describe('when callback is function', function() {

            it('should call callback', function() {
                spyOn(widget, 'callback');
                widget.save();
                expect(widget.callback).toHaveBeenCalledWith(widget.text());
            });

        });

    });

    describe('show:', function () {

        var someText, points, wrapper, callback;

        beforeEach(function () {
            someText = 'some text';
            points = {};
            wrapper = {};
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
            widget.show(someText, wrapper, points, callback);
            expect(widget.text()).toBe(someText);
            expect(widget.wrapper()).toBe(wrapper);
            expect(widget.points()).toBe(points);
            expect(widget.callback).toBe(callback);
        });

    });

});