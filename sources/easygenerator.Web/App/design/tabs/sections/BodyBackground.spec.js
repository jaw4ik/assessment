import BodyBackground from './BodyBackground';

import {
    EVENT_BODY_BACKGROUND_TEXTURE_CHANGED,
    EVENT_BODY_BACKGROUND_COLOR_CHANGED,
    EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED
} from './BodyBackground';

import bus from './../../bus';

let describe = window.describe;
let it = window.it;
let expect = window.expect;
let beforeEach = window.beforeEach;
let spyOn = window.spyOn;

describe('BodyBackground section', () => {

    beforeEach(() => {
        spyOn(bus, 'trigger');
    });

    describe('body:', () => {

        it('should be object', () => {
            let background = new BodyBackground();

            expect(background).toBeObject();
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
                
                it(`should not trigger event ${EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED }`, () => {
                    let background = new BodyBackground();
                    background.changeBrightness(NaN);
                    expect(bus.trigger).not.toHaveBeenCalledWith(EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED );
                }); 

            });

            describe('when brightness has not changed', () => {
                
                it(`should not trigger event ${EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED }`, () => {
                    let background = new BodyBackground();
                    background.brightness(0.2);
                    background.changeBrightness(0.2);
                    expect(bus.trigger).not.toHaveBeenCalledWith(EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED );
                }); 

            });

            it('should change body brightness', () => {
                let background = new BodyBackground();
                background.brightness(0);

                background.changeBrightness(0.4);
                expect(background.brightness()).toEqual(0.4);
            });

            it(`should trigger event ${EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED }`, () => {
                let background = new BodyBackground();
                background.changeBrightness(0.4);
                expect(bus.trigger).toHaveBeenCalledWith(EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED );
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

            it('should reset image', () => {
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

        });

        describe('activate:', () => {

            describe('when body color is defined', () => {
                
                it('should set corresponding color', () => {
                    let background = new BodyBackground();
                    background.activate({
                        color:'#aabbcc'
                    });

                    expect(background.color()).toEqual('#aabbcc');
                });

                it('should set corresponding color to popover', () => {
                    let background = new BodyBackground();
                    background.popover.color(null);
                    background.activate({
                        color:'#aabbcc'
                    });

                    expect(background.popover.color()).toEqual('#aabbcc');
                });

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

            describe('when body color is not defined', () => {
                
                it('should set null to color', () => {
                    let background = new BodyBackground();
                    background.color('#aabbcc');
                    background.activate();

                    expect(background.color()).toEqual(null);
                });

                it('should set null to popover color', () => {
                    let background = new BodyBackground();
                    background.popover.color('#aabbcc');
                    background.activate();

                    expect(background.popover.color()).toEqual(null);
                });

                describe('and body texture is defined', () => {

                    it('should set corresponding texture', () => {
                        let background = new BodyBackground();
                        background.activate({
                            texture: 'url'
                        });

                        expect(background.texture()).toEqual('url');
                    });

                    it('should set corresponding texture to popover', () => {
                        let background = new BodyBackground();
                        background.popover.texture(null);
                        background.activate({
                            texture: 'url'
                        });

                        expect(background.popover.texture()).toEqual('url');
                    });

                });


                describe('and body texture is not defined', () => {
                    
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

            describe('when body brightness is defined', () => {

                it('should set corresponding brightness', () => {
                    let background = new BodyBackground();
                    background.activate({
                        brightness: 0.5
                    });

                    expect(background.brightness()).toEqual(0.5);
                });

            });

            describe('when body brightness is not defined', () => {
                
                it('should set 0 to brightness', () => {
                    let background = new BodyBackground();
                    background.brightness(1);
                    background.activate();

                    expect(background.brightness()).toEqual(0);
                });

            });

        });

    });

});