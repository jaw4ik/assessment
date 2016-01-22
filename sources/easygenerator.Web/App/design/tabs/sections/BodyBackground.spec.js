import BodyBackground from './BodyBackground';

import {
    EVENT_BODY_BACKGROUND_ENABLED_CHANGED,
    EVENT_BODY_BACKGROUND_TEXTURE_CHANGED,
    EVENT_BODY_BACKGROUND_COLOR_CHANGED,
    EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED
} from './BodyBackground';

import bus from './../../bus';

import eventTracker from 'eventTracker';

describe('BodyBackground section', () => {

    beforeEach(() => {
        spyOn(bus, 'trigger');
        spyOn(eventTracker, 'publish');
    });

    describe('body:', () => {

        it('should be object', () => {
            let background = new BodyBackground();

            expect(background).toBeObject();
        });

        describe('enabled:', () => {
            it('should be observable', () => {
                let background = new BodyBackground();

                expect(background.enabled).toBeObservable();
            });
        });

        describe('toggleEnabled:', () => {

            it('should change expanded state', () => {
                let background = new BodyBackground();
                background.enabled(false);

                background.toggleEnabled();

                expect(background.enabled()).toBeTruthy();
            });

            it(`should trigger event ${EVENT_BODY_BACKGROUND_ENABLED_CHANGED}`, () => {
                let background = new BodyBackground();
                background.toggleEnabled();
                expect(bus.trigger).toHaveBeenCalledWith(EVENT_BODY_BACKGROUND_ENABLED_CHANGED);
            });

            describe('when enabled state became true', () => {
                it(`should trigger event 'Switch to multiple backgrounds'`, () => {
                    let background = new BodyBackground();
                    background.enabled(false);
                    background.toggleEnabled();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Switch to multiple backgrounds');
                });
            });

            describe('when expanded state became false', () => {
                it(`should trigger event 'Switch to one background'`, () => {
                    let background = new BodyBackground();
                    background.enabled(true);
                    background.toggleEnabled();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Switch to one background');
                });
            });

        });

        describe('changeBackground:', () => {

            it('should show header background popover', () => {
                let background = new BodyBackground();
                background.changeBackground(null);
                expect(background.popover.isVisible()).toBeTruthy();
            });

        });

        describe('brightness:', () => {

            it('should be observable', () => {
                let background = new BodyBackground();

                expect(background.brightness).toBeObservable();
            });

        });

        describe('changeBrightness:', () => {

            describe('when brightness is NaN', () => {

                it('should not change body brightness', () => {
                    let background = new BodyBackground();
                    background.brightness(0.4);

                    background.changeBrightness(NaN);
                    expect(background.brightness()).toEqual(0.4);
                });

                it(`should not trigger event ${EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED}`, () => {
                    let background = new BodyBackground();
                    background.changeBrightness(NaN);
                    expect(bus.trigger).not.toHaveBeenCalledWith(EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED);
                });

                it(`should not trigger event 'Change secondary background'`, () => {
                    let background = new BodyBackground();
                    background.changeBrightness(NaN);
                    expect(eventTracker.publish).not.toHaveBeenCalledWith('Change secondary background');
                });

            });

            describe('when brightness has not changed', () => {

                it(`should not trigger event ${EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED}`, () => {
                    let background = new BodyBackground();
                    background.brightness(0.2);
                    background.changeBrightness(0.2);
                    expect(bus.trigger).not.toHaveBeenCalledWith(EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED);
                });

                it(`should not trigger event 'Change secondary background'`, () => {
                    let background = new BodyBackground();
                    background.brightness(0.2);
                    background.changeBrightness(0.2);
                    expect(eventTracker.publish).not.toHaveBeenCalledWith('Change secondary background');
                });

            });

            it('should change body brightness', () => {
                let background = new BodyBackground();
                background.brightness(0);

                background.changeBrightness(0.4);
                expect(background.brightness()).toEqual(0.4);
            });

            it(`should trigger event ${EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED}`, () => {
                let background = new BodyBackground();
                background.changeBrightness(0.4);
                expect(bus.trigger).toHaveBeenCalledWith(EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED);
            });

            it(`should trigger event 'Change secondary background'`, () => {
                let background = new BodyBackground();
                background.changeBrightness(0.4);
                expect(eventTracker.publish).toHaveBeenCalledWith('Change secondary background');
            });

        });

        describe('texture:', () => {

            it('should be observable', () => {
                let background = new BodyBackground();

                expect(background.texture).toBeObservable();
            });

        });

        describe('updateTexture:', () => {

            it('should update texture', () => {
                let background = new BodyBackground();

                background.updateTexture('texture');
                expect(background.texture()).toEqual('texture');
            });

            it('should reset color', () => {
                let background = new BodyBackground();
                background.color('#aabbcc');

                background.updateTexture('image');
                expect(background.color()).toEqual(null);
            });

            it(`should trigger event ${EVENT_BODY_BACKGROUND_TEXTURE_CHANGED}`, () => {
                let background = new BodyBackground();
                background.updateTexture('image');
                expect(bus.trigger).toHaveBeenCalledWith(EVENT_BODY_BACKGROUND_TEXTURE_CHANGED);
            });

            it(`should trigger event 'Change secondary background'`, () => {
                let background = new BodyBackground();
                background.updateTexture('image');
                expect(eventTracker.publish).toHaveBeenCalledWith('Change secondary background');
            });

        });

        describe('color:', () => {

            it('should be observable', () => {
                let background = new BodyBackground();

                expect(background.color).toBeObservable();
            });

        });

        describe('updateColor:', () => {

            it('should update color', () => {
                let background = new BodyBackground();
                background.color('#000');

                background.updateColor('#aabbcc');
                expect(background.color()).toEqual('#aabbcc');
            });

            it('should reset texture', () => {
                let background = new BodyBackground();
                background.texture('texture');

                background.updateColor('#aabbcc');
                expect(background.texture()).toEqual(null);
            });

            it(`should trigger event ${EVENT_BODY_BACKGROUND_COLOR_CHANGED}`, () => {
                let background = new BodyBackground();
                background.updateColor('#aabbcc');
                expect(bus.trigger).toHaveBeenCalledWith(EVENT_BODY_BACKGROUND_COLOR_CHANGED);
            });

            it(`should trigger event 'Change secondary background'`, () => {
                let background = new BodyBackground();
                background.updateColor('#aabbcc');
                expect(eventTracker.publish).toHaveBeenCalledWith('Change secondary background');
            });

        });

        describe('activate:', () => {

            describe('when enabled is defined', () => {

                it('should set corresponding enabled value', () => {
                    let background = new BodyBackground();
                    background.activate({ enabled: true });

                    expect(background.enabled()).toBeTruthy();
                });

            });

            describe('when enabled is not defined', () => {

                describe('and enabled is specified in defaults', () => {

                    it('should set corresponding enabled value', () => {
                        let background = new BodyBackground();
                        background.activate(null, { enabled: true });;

                        expect(background.enabled()).toBeTruthy();
                    });

                });

                describe('and enabled is not specified in defaults', () => {

                    it('should set false to enabled', () => {
                        let background = new BodyBackground();
                        background.activate();

                        expect(background.enabled()).toBeFalsy();
                    });

                });

            });

            describe('and color is defined', () => {

                it('should set corresponding color', () => {
                    let background = new BodyBackground();
                    background.activate({ color: '#aabbcc' });

                    expect(background.color()).toEqual('#aabbcc');
                });

                it('should set corresponding color to popover', () => {
                    let background = new BodyBackground();
                    background.popover.color(null);

                    background.activate({ color: '#aabbcc' });

                    expect(background.popover.color()).toEqual('#aabbcc');
                });

            });

            describe('and color is not defined', () => {

                describe('and color is specified in defaults', () => {

                    it('should set corresponding color', () => {
                        let background = new BodyBackground();
                        background.activate(null, { color: '#aabbcc' });

                        expect(background.color()).toEqual('#aabbcc');
                    });

                    it('should set corresponding color to popover', () => {
                        let background = new BodyBackground();
                        background.popover.color(null);

                        background.activate(null, { color: '#aabbcc' });

                        expect(background.popover.color()).toEqual('#aabbcc');
                    });

                });

                describe('and color is not specified in defaults', () => {

                    it('should set null to color', () => {
                        let background = new BodyBackground();
                        background.color('#aabbcc');
                        background.activate();

                        expect(background.color()).toEqual(null);
                    });

                    it('should set null to popover  color', () => {
                        let background = new BodyBackground();
                        background.popover.color('#aabbcc');
                        background.activate();

                        expect(background.popover.color()).toEqual(null);
                    });

                });

            });

            describe('when texture is defined', () => {

                it('should set corresponding texture', () => {
                    let background = new BodyBackground();
                    background.activate({ texture: 'url' });

                    expect(background.texture()).toEqual('url');
                });

                it('should set corresponding texture to popover', () => {
                    let background = new BodyBackground();
                    background.popover.texture(null);
                    background.activate({ texture: 'url' });

                    expect(background.popover.texture()).toEqual('url');
                });

            });

            describe('when texture is not defined', () => {

                describe('and texture is specified in defaults', () => {

                    it('should set corresponding texture', () => {
                        let background = new BodyBackground();
                        background.activate(null, { texture: 'url' });

                        expect(background.texture()).toEqual('url');
                    });

                    it('should set corresponding texture to popover', () => {
                        let background = new BodyBackground();
                        background.popover.texture(null);
                        background.activate(null, { texture: 'url' });

                        expect(background.popover.texture()).toEqual('url');
                    });

                });

                describe('and texture is not specified in defaults', () => {

                    it('should set null to texture', () => {
                        let background = new BodyBackground();
                        background.texture('url');
                        background.activate();

                        expect(background.texture()).toEqual(null);
                    });

                    it('should set null to popover texture', () => {
                        let background = new BodyBackground();
                        background.popover.texture('url');
                        background.activate();

                        expect(background.popover.texture()).toEqual(null);
                    });

                });

            });

            describe('when brightness is defined', () => {

                it('should set corresponding brightness', () => {
                    let background = new BodyBackground();
                    background.activate({ brightness: 0.5 });

                    expect(background.brightness()).toEqual(0.5);
                });

            });

            describe('when brightness is not defined', () => {

                describe('and brightness is specified in defaults', () => {

                    it('should set corresponding brightness', () => {
                        let background = new BodyBackground();
                        background.activate(null, { brightness: 0.5 });

                        expect(background.brightness()).toEqual(0.5);
                    });

                });

                describe('and brightness is not specified in defaults', () => {

                    it('should set 0 to brightness', () => {
                        let background = new BodyBackground();
                        background.brightness(1);
                        background.activate();

                        expect(background.brightness()).toEqual(0);
                    });

                });

            });

            describe('when defaults are defined', () => {

                it('should set defaults', () => {
                    let background = new BodyBackground();
                    let defaults = {};
                    background.activate({}, defaults);

                    expect(background.defaults).toEqual(defaults);
                });

            });

            describe('when defaults are not defined', () => {

                it('should set defaults to null', () => {
                    let background = new BodyBackground();
                    background.defaults = {};
                    background.activate();

                    expect(background.defaults).toEqual(null);
                });

            });

        });

    });

});