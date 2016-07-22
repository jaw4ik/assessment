import ColorpickerPopover from './ColorpickerPopover';
import { EVENT_COLORPICKER_COLOR_SELECTED } from './ColorpickerPopover';
import bus from 'design/bus';

let describe = window.describe;
let it = window.it;
let expect = window.expect;
let beforeEach = window.beforeEach;
let spyOn = window.spyOn;

describe('Colorpicker popover', () => {

    describe('isVisible:', () => {
        
        it('should be observable', () => {
            let popover = new ColorpickerPopover();
            expect(popover.isVisible).toBeObservable();
        });

    });

    describe('value:', () => {

        it('should be observable', () => {
            expect(new ColorpickerPopover().value).toBeObservable();
            expect(new ColorpickerPopover().value()).toEqual(null);
            expect(new ColorpickerPopover('#aabbcc').value()).toEqual('#aabbcc');
        });

    });

    describe('changed:', () => {

        it('should trigger event', () => {
            let popover = new ColorpickerPopover();
            spyOn(popover, 'trigger');
            popover.value('#aabbcc');
            popover.changed();
            expect(popover.trigger).toHaveBeenCalledWith(EVENT_COLORPICKER_COLOR_SELECTED, '#aabbcc');
        });

    });

});