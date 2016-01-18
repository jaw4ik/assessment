import HeaderBackground from './HeaderBackground';
import {
    BACKGROUND_IMAGE_FULLSCREEN,
    BACKGROUND_IMAGE_REPEAT,
    BACKGROUND_IMAGE_ORIGINAL,

    EVENT_HEADER_BACKGROUND_EXPANDED_CHANGED,
    EVENT_HEADER_BACKGROUND_IMAGE_CHANGED,
    EVENT_HEADER_BACKGROUND_IMAGE_REMOVED,
    EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED,
    EVENT_HEADER_BACKGROUND_COLOR_CHANGED,
    EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED
} from './HeaderBackground';

import bus from './../../bus';

let describe = window.describe;
let it = window.it;
let expect = window.expect;
let beforeEach = window.beforeEach;
let spyOn = window.spyOn;

describe('Header background design section', () => {

    beforeEach(() => {
        spyOn(bus, 'trigger');
    });

    describe('expanded:', () => {
        it('should be observable', () => {
            let background = new HeaderBackground();

            expect(background.expanded).toBeObservable();
        });
    });

    describe('toggleExpanded:', () => {

        it('should change expanded state', () => {
            let background = new HeaderBackground();
            background.expanded(false);

            background.toggleExpanded();

            expect(background.expanded()).toBeTruthy();
        });

        it(`should trigger event ${EVENT_HEADER_BACKGROUND_EXPANDED_CHANGED}`, () => {
            let background = new HeaderBackground();
            background.toggleExpanded();
            expect(bus.trigger).toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_EXPANDED_CHANGED);
        });

    });

    describe('changeBackground:', () => {

        it('should show popover', () => {
            let background = new HeaderBackground();
            background.changeBackground();
            expect(background.popover.isVisible()).toBeTruthy();
        });

    });

    describe('image:', () => {

        it('should be observable', () => {
            let background = new HeaderBackground();
            expect(background.image).toBeObservable();
        });

        describe('isDefault:', () => {

            it('should be computed', () => {
                let background = new HeaderBackground();
                expect(background.image.isDefault).toBeComputed();
            });

            describe('when defaults are not an object', () => {

                it('should return false', () => {
                    let background = new HeaderBackground();
                    expect(background.image.isDefault()).toBeFalsy();
                });

            });

            describe('when defaults have a default image url', () => {

                describe('and current image has the same url', () => {

                    it('should return true', () => {
                        let background = new HeaderBackground();
                        background.defaults = {
                            image: {
                                url: 'url'
                            }
                        };
                        background.image('url');
                        expect(background.image.isDefault()).toBeTruthy();
                    });

                });

                describe('and current image has another url', () => {

                    it('should return false', () => {
                        let background = new HeaderBackground();
                        background.defaults = {
                            image: {
                                url: 'url'
                            }
                        };
                        background.image('URL');
                        expect(background.image.isDefault()).toBeFalsy();
                    });

                });

            });

        });

    });

    describe('updateImage:', () => {

        it('should update image', () => {
            let background = new HeaderBackground();
            background.image('');

            background.updateImage('image');
            expect(background.image()).toEqual('image');
        });

        it(`should set option to ${BACKGROUND_IMAGE_FULLSCREEN}`, () => {
            let background = new HeaderBackground();
            background.option(null);

            background.updateImage('image');
            expect(background.option()).toEqual(BACKGROUND_IMAGE_FULLSCREEN);
        });

        it('should reset color', () => {
            let background = new HeaderBackground();
            background.color('#aabbcc');

            background.updateImage('image');
            expect(background.color()).toEqual(null);
        });

        it(`should trigger event ${EVENT_HEADER_BACKGROUND_IMAGE_CHANGED}`, () => {
            let background = new HeaderBackground();
            background.updateImage('image');
            expect(bus.trigger).toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_IMAGE_CHANGED);
        });

    });

    describe('removeImage:', () => {

        describe('when defaults have a default image url', () => {

            it('should set image', () => {
                let background = new HeaderBackground();
                background.image('url');
                background.defaults = { image: { url: 'URL' } };

                background.removeImage();
                expect(background.image()).toEqual('URL');
            });

        });

        describe('when defaults do not have a default image url', () => {

            it('should set image', () => {
                let background = new HeaderBackground();
                background.defaults = null;

                background.removeImage();
                expect(background.image()).toEqual(null);
            });

        });

        it(`should trigger event ${EVENT_HEADER_BACKGROUND_IMAGE_REMOVED}`, () => {
            let background = new HeaderBackground();
            background.removeImage();
            expect(bus.trigger).toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_IMAGE_REMOVED);
        });

    });

    describe('color:', () => {

        it('should be observable', () => {
            let background = new HeaderBackground();

            expect(background.color).toBeObservable();
        });

    });

    describe('updateColor:', () => {

        it('should update color', () => {
            let background = new HeaderBackground();
            background.color('#000');

            background.updateColor('#aabbcc');
            expect(background.color()).toEqual('#aabbcc');
        });

        it('should reset image', () => {
            let background = new HeaderBackground();
            background.image('image');

            background.updateColor('#aabbcc');
            expect(background.image()).toEqual(null);
        });

        it(`should trigger event ${EVENT_HEADER_BACKGROUND_COLOR_CHANGED}`, () => {
            let background = new HeaderBackground();
            background.updateColor('#aabbcc');
            expect(bus.trigger).toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_COLOR_CHANGED);
        });

    });

    describe('option:', () => {

        it('should be observable', () => {
            let background = new HeaderBackground();

            expect(background.option).toBeObservable();
        });

        it('should be ' + BACKGROUND_IMAGE_FULLSCREEN + ' by default', () => {
            let background = new HeaderBackground();

            expect(background.option()).toEqual(BACKGROUND_IMAGE_FULLSCREEN);
        });

    });

    describe('swithToFullscreen:', () => {

        describe(`when option is ${BACKGROUND_IMAGE_FULLSCREEN}`, () => {

            it(`should not trigger event ${EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED}`, () => {
                let background = new HeaderBackground();
                background.option(BACKGROUND_IMAGE_FULLSCREEN);

                background.switchToFullscreen();
                expect(bus.trigger).not.toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED);
            });

        });

        it(`should set option to ${BACKGROUND_IMAGE_FULLSCREEN} by default`, () => {
            let background = new HeaderBackground();
            background.option(null);

            background.switchToFullscreen();

            expect(background.option()).toEqual(BACKGROUND_IMAGE_FULLSCREEN);
        });

        it(`should trigger event ${EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED}`, () => {
            let background = new HeaderBackground();
            background.option(null);

            background.switchToFullscreen();
            expect(bus.trigger).toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED);
        });
    });

    describe('switchToRepeat:', () => {

        describe(`when option is ${BACKGROUND_IMAGE_REPEAT}`, () => {

            it(`should not trigger event ${EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED}`, () => {
                let background = new HeaderBackground();
                background.option(BACKGROUND_IMAGE_REPEAT);

                background.switchToRepeat();
                expect(bus.trigger).not.toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED);
            });

        });

        it(`should set option to ${BACKGROUND_IMAGE_REPEAT} by default`, () => {
            let background = new HeaderBackground();
            background.option(null);

            background.switchToRepeat();

            expect(background.option()).toEqual(BACKGROUND_IMAGE_REPEAT);
        });

        it(`should trigger event ${EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED}`, () => {
            let background = new HeaderBackground();
            background.option(null);

            background.switchToRepeat();
            expect(bus.trigger).toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED);
        });

    });

    describe('switchToOriginal:', () => {

        describe(`when option is ${BACKGROUND_IMAGE_ORIGINAL}`, () => {

            it(`should not trigger event ${EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED}`, () => {
                let background = new HeaderBackground();
                background.option(BACKGROUND_IMAGE_ORIGINAL);

                background.switchToOriginal();
                expect(bus.trigger).not.toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED);
            });

        });

        it(`should set option to ${BACKGROUND_IMAGE_ORIGINAL} by default`, () => {
            let background = new HeaderBackground();
            background.option(null);

            background.switchToOriginal();

            expect(background.option()).toEqual(BACKGROUND_IMAGE_ORIGINAL);
        });

        it(`should trigger event ${EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED}`, () => {
            let background = new HeaderBackground();
            background.option(null);

            background.switchToOriginal();
            expect(bus.trigger).toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED);
        });

    });

    describe('isFullscreen:', () => {

        it('should be computed', () => {
            let background = new HeaderBackground();
            expect(background.isFullscreen).toBeComputed();
        });

        describe('when option is ' + BACKGROUND_IMAGE_FULLSCREEN, () => {

            it('should return true', () => {
                let background = new HeaderBackground();
                background.option(BACKGROUND_IMAGE_FULLSCREEN);
                expect(background.isFullscreen()).toBeTruthy();
            });

        });

    });

    describe('isRepeat:', () => {

        it('should be computed', () => {
            let background = new HeaderBackground();
            expect(background.isRepeat).toBeComputed();
        });

        describe('when option is ' + BACKGROUND_IMAGE_REPEAT, () => {

            it('should return true', () => {
                let background = new HeaderBackground();
                background.option(BACKGROUND_IMAGE_REPEAT);
                expect(background.isRepeat()).toBeTruthy();
            });

        });

    });

    describe('isOriginal:', () => {

        it('should be computed', () => {
            let background = new HeaderBackground();
            expect(background.isOriginal).toBeComputed();
        });

        describe('when option is ' + BACKGROUND_IMAGE_ORIGINAL, () => {

            it('should return true', () => {
                let background = new HeaderBackground();
                background.option(BACKGROUND_IMAGE_ORIGINAL);
                expect(background.isOriginal()).toBeTruthy();
            });

        });

    });

    describe('brightness:', () => {

        it('should be observable', () => {
            let background = new HeaderBackground();

            expect(background.brightness).toBeObservable();
        });

    });

    describe('changeBrightness:', () => {

        it('should be function', () => {
            let background = new HeaderBackground();

            expect(background.changeBrightness).toBeFunction();
        });

        describe('when brightness is number', () => {

            it('should change body brightness', () => {
                let background = new HeaderBackground();
                background.brightness(0);

                background.changeBrightness(0.4);
                expect(background.brightness()).toEqual(0.4);
            });

            it(`should trigger event ${EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED}`, () => {
                let background = new HeaderBackground();
                background.changeBrightness(0.4);
                expect(bus.trigger).toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED);
            });

        });

        describe('when brightness is NaN', () => {

            it('should not change body brightness', () => {
                let background = new HeaderBackground();
                background.brightness(0.2);

                background.changeBrightness(NaN);
                expect(background.brightness()).toEqual(0.2);
            });

            it(`should not trigger event ${EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED}`, () => {
                let background = new HeaderBackground();
                background.changeBrightness(NaN);
                expect(bus.trigger).not.toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED);
            });

        });

        describe('when brightness has not changed', () => {

            it(`should not trigger event ${EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED}`, () => {
                let background = new HeaderBackground();
                background.brightness(0.2);
                background.changeBrightness(0.2);
                expect(bus.trigger).not.toHaveBeenCalledWith(EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED);
            });

        });

    });

    describe('activate:', () => {

        describe('when expanded is defined', () => {

            it('should set corresponding expanded value', () => {
                let background = new HeaderBackground();
                background.activate({ expanded: true });

                expect(background.expanded()).toBeTruthy();
            });

        });

        describe('when expanded is not defined', () => {

            describe('and expanded is specified in defaults', () => {

                it('should set corresponding expanded value', () => {
                    let background = new HeaderBackground();
                    background.activate(null, { expanded: true });;

                    expect(background.expanded()).toBeTruthy();
                });

            });

            describe('and expanded is not specified in defaults', () => {

                it('should set false to expanded', () => {
                    let background = new HeaderBackground();
                    background.activate();

                    expect(background.expanded()).toBeFalsy();
                });

            });

        });

        describe('when image is defined', () => {

            it('should set corresponding image', () => {
                let background = new HeaderBackground();
                background.activate({ image: { url: 'url' } });

                expect(background.image()).toEqual('url');
            });

            it('should set corresponding image option', () => {
                let background = new HeaderBackground();
                background.activate({ image: { option: 'fullscreen' } });

                expect(background.option()).toEqual('fullscreen');
            });

            it('should set corresponding image to popover', () => {
                let background = new HeaderBackground();
                background.popover.image(null);
                background.activate({ image: { url: 'url' } });

                expect(background.popover.image()).toEqual('url');
            });

        });

        describe('when image is not defined', () => {

            describe('and image is specified in defaults', () => {

                it('should set corresponding image', () => {
                    let background = new HeaderBackground();
                    background.activate(null, { image: { url: 'url' } });

                    expect(background.image()).toEqual('url');
                });

                it('should set corresponding image option', () => {
                    let background = new HeaderBackground();
                    background.activate(null, { image: { option: 'fullscreen' } });

                    expect(background.option()).toEqual('fullscreen');
                });

                it('should set corresponding image to popover', () => {
                    let background = new HeaderBackground();
                    background.popover.image(null);
                    background.activate(null, { image: { url: 'url' } });

                    expect(background.popover.image()).toEqual('url');
                });

            });

            describe('and image is not specified in defaults', () => {

                it('should set null to image', () => {
                    let background = new HeaderBackground();
                    background.image('url');
                    background.activate();

                    expect(background.image()).toEqual(null);
                });

                it('should set null to option', () => {
                    let background = new HeaderBackground();
                    background.option('fullscreen');
                    background.activate();

                    expect(background.option()).toEqual(null);
                });

                it('should set null to popover image', () => {
                    let background = new HeaderBackground();
                    background.popover.image('url');
                    background.activate();

                    expect(background.popover.image()).toEqual(null);
                });

            });

        });

        describe('and color is defined', () => {

            it('should set corresponding color', () => {
                let background = new HeaderBackground();
                background.activate({ color: '#aabbcc' });

                expect(background.color()).toEqual('#aabbcc');
            });

            it('should set corresponding color to popover', () => {
                let background = new HeaderBackground();
                background.popover.color(null);

                background.activate({ color: '#aabbcc' });

                expect(background.popover.color()).toEqual('#aabbcc');
            });

        });

        describe('and color is not defined', () => {

            describe('and color is specified in defaults', () => {

                it('should set corresponding color', () => {
                    let background = new HeaderBackground();
                    background.activate(null, { color: '#aabbcc' });

                    expect(background.color()).toEqual('#aabbcc');
                });

                it('should set corresponding color to popover', () => {
                    let background = new HeaderBackground();
                    background.popover.color(null);

                    background.activate(null, { color: '#aabbcc' });

                    expect(background.popover.color()).toEqual('#aabbcc');
                });

            });

            describe('and color is not specified in defaults', () => {

                it('should set null to color', () => {
                    let background = new HeaderBackground();
                    background.color('#aabbcc');
                    background.activate();

                    expect(background.color()).toEqual(null);
                });

                it('should set null to popover  color', () => {
                    let background = new HeaderBackground();
                    background.popover.color('#aabbcc');
                    background.activate();

                    expect(background.popover.color()).toEqual(null);
                });

            });

        });

        describe('when brightness is defined', () => {

            it('should set corresponding brightness', () => {
                let background = new HeaderBackground();
                background.activate({ brightness: 0.5 });

                expect(background.brightness()).toEqual(0.5);
            });

        });

        describe('when brightness is not defined', () => {

            describe('and brightness is specified in defaults', () => {

                it('should set corresponding brightness', () => {
                    let background = new HeaderBackground();
                    background.activate(null, { brightness: 0.5 });

                    expect(background.brightness()).toEqual(0.5);
                });

            });

            describe('and brightness is not specified in defaults', () => {

                it('should set 0 to brightness', () => {
                    let background = new HeaderBackground();
                    background.brightness(1);
                    background.activate();

                    expect(background.brightness()).toEqual(0);
                });

            });

        });

        describe('when defaults are defined', () => {

            it('should set defaults', () => {
                let background = new HeaderBackground();
                let defaults = { image: { url: '' } };
                background.activate({}, defaults);

                expect(background.defaults).toEqual(defaults);
            });

        });

        describe('when defaults are not defined', () => {

            it('should set defaults to null', () => {
                let background = new HeaderBackground();
                background.defaults = {};
                background.activate();

                expect(background.defaults).toEqual(null);
            });

        });

    });

});