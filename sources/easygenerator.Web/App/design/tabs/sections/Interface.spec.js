import Interface from './Interface';
import { Color } from './Interface';
import ColorpickerPopover from './ColorpickerPopover';
import { EVENT_COLOR_SELECTED } from './Interface';

import userContext from 'userContext';

import bus from './../../bus';

let describe = window.describe;
let it = window.it;
let expect = window.expect;

describe('Interface Color', () => {
    
    beforeEach(() => {
        spyOn(bus, 'trigger');
    });

    describe('key:', () => {

        it('should be defined', () => {
            let color = new Color({
                key: 'key'
            });
            expect(color.key).toEqual('key');
        });

    });

    describe('value:', () => {

        it('should be observable', () => {
            let color = new Color({
                value: '#aabbcc'
            });
            expect(color.value).toBeObservable();
            expect(color.value()).toEqual('#aabbcc');
        });

    });

    describe('title:', () => {

        it('should be humanized key', () => {
            let color = new Color({
                key: '@main-color'
            });
            expect(color.title).toEqual('Main color');
        });

    });

    describe('popover:', () => {

        it('should be defined', () => {
            let color = new Color();
            expect(color.popover).toBeInstanceOf(ColorpickerPopover);
        });

    });

    describe('showPopover:', () => {
        
        it('should show popover with colorpicker', () => {
            let color = new Color();
            color.showPopover();
            expect(color.popover.isVisible()).toBeTruthy();
        });

    });

    describe('valueChanged:', () => {

        it('should update value', () => {
            let color = new Color();
            color.updateValue('#ebb');
            expect(color.value()).toEqual('#ebb');
        });

        it(`should trigger event ${EVENT_COLOR_SELECTED}`, () => {
            let color = new Color();

            color.updateValue('#ebb');

            expect(bus.trigger).toHaveBeenCalledWith(EVENT_COLOR_SELECTED);
        });

    });

});

describe('Interface design section', () => {

    beforeEach(() => {
        spyOn(bus, 'trigger');
    });

    describe('when spec was not provided', () => {

        it('should create an empty object', () => {
            let int = new Interface();
            expect(int.title).toBeDefined();
        });

    });

    describe('expanded:', () => {
        
        it('should be observable', () => {
            let logo = new Interface();
            expect(logo.expanded).toBeObservable();
        });

    });

    describe('toggleExpanded:', () => {
        
        it('should change expanded state', () => {
            let int = new Interface();
            int.expanded(false);

            int.toggleExpanded();

            expect(int.expanded()).toBeTruthy();
        });

    });

    describe('colors:', () => {
        
        it('should be observable array', () => {
            let int = new Interface();
            expect(int.colors).toBeObservableArray();
        });

    });

    describe('activate:', () => {

        describe('when colors is not an array', () => {

            it('should set an empty colors array', () => {
                let int = new Interface();
                int.activate();
                expect(int.colors().length).toEqual(0);
            });

        });

        describe('when colors is an array', () => {

            it('should set colors array', () => {
                let int = new Interface();

                int.activate([{ key: '@main-color', value: '#000000' }, { key: '@secondary-color', value: '#aabbcc' }]);
                expect(int.colors().length).toEqual(2);
                expect(int.colors()[0].key).toEqual('@main-color');
                expect(int.colors()[0].value()).toEqual('#000000');
                expect(int.colors()[1].key).toEqual('@secondary-color');
                expect(int.colors()[1].value()).toEqual('#aabbcc');
            });

        });
        describe('when user has Plus plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
            });

            it('should set available true', () =>{

                let int = new Interface();
                int.activate();

                expect(int.available).toBeTruthy();
        
            });
        });

        describe('when user doesn`t have  Plus plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
            });

            it('should set available false', () =>{

                let int = new Interface();
                int.activate();

                expect(int.available).toBeFalsy();;
            });

        });

    });

});