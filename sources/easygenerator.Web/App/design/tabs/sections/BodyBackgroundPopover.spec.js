import { BackgroundPopover, COLOR_MODE, TEXTURE_MODE, EVENT_TEXTURE_SELECTED, EVENT_COLOR_SELECTED } from './BodyBackgroundPopover.js';

import notify from 'notify';
import imageUpload from 'imageUpload';

let describe = window.describe;
let it = window.it;
let expect = window.expect;
let spyOn = window.spyOn;

describe('Background popover class', () => {

    it('should create an empty object', () => {
        let background = new BackgroundPopover();
        expect(background).toBeDefined();
    });

    describe('isVisible:', () => {
        it('should be observable', () => {
            let background = new BackgroundPopover();
            expect(background.isVisible).toBeObservable();
        });
    });

    describe('colors:', () => {
        
        it('should be an observable array', () => {
            let background = new BackgroundPopover();
            expect(background.colors).toBeObservableArray();
        });

    });

    describe('color', () => {
       
        it('should be observable', () => {
            let background = new BackgroundPopover();
            expect(background.color).toBeObservable();
        });

    });

    describe('mode:', () => {

        it('should be observable', () => {
            let background = new BackgroundPopover();
            expect(background.mode).toBeObservable();
        });

        it(`should be ${COLOR_MODE} by default`, () => {
            let background = new BackgroundPopover();
            expect(background.mode()).toEqual(COLOR_MODE);
        });
    });

    describe('isColorMode:', () => {

        it('should be computed', () => {
            let background = new BackgroundPopover();
            expect(background.isColorMode).toBeComputed();
        });

        describe(`when mode is ${COLOR_MODE}`, () => {

            it('should return true', () => {
                let background = new BackgroundPopover();
                background.mode(COLOR_MODE);

                expect(background.isColorMode()).toBeTruthy();
            });

        });

    });

    describe('isTextureMode:', () => {

        it('should be computed', () => {
            let background = new BackgroundPopover();
            expect(background.isTextureMode).toBeComputed();
        });

        describe(`when mode is ${TEXTURE_MODE}`, () => {

            it('should return true', () => {
                let background = new BackgroundPopover();
                background.mode(TEXTURE_MODE);

                expect(background.isTextureMode()).toBeTruthy();
            });

        });

    });

    describe('toColorMode:', () => {

        it(`should set mode to ${COLOR_MODE}`, () => {
            let background = new BackgroundPopover();
            background.mode(TEXTURE_MODE);

            background.toColorMode();

            expect(background.mode()).toEqual(COLOR_MODE);
        });

    });

    describe('toTextureMode:', () => {

        it(`should set mode to ${TEXTURE_MODE}`, () => {
            let background = new BackgroundPopover();
            background.mode(COLOR_MODE);

            background.toTextureMode();

            expect(background.mode()).toEqual(TEXTURE_MODE);
        });

    });

    describe('isColorPickerVisible', () => {

        it('should be observable', () => {
            let background = new BackgroundPopover();
            expect(background.isColorPickerVisible).toBeObservable();
        });

    });

    describe('showColorPicker:', () => {

        it('should show colorpicker', () => {
            let background = new BackgroundPopover();
            background.isColorPickerVisible(false);
            background.showColorPicker();
            expect(background.isColorPickerVisible()).toBeTruthy();
        });

    });

    describe('hideColorPicker:', () => {

        it('should hide colorpicker', () => {
            let background = new BackgroundPopover();
            background.isColorPickerVisible(true);
            background.hideColorPicker();
            expect(background.isColorPickerVisible()).toBeFalsy();
        });

    });

    describe('attemptedColor:', () => {
        
        it('should be observable', () => {
            let background = new BackgroundPopover();
            expect(background.attemptedColor).toBeObservable();
        });

    });

    describe('pickColor:', () => {

        it('should pick current color picker color as the selected one', () => {
            let background = new BackgroundPopover();
            background.color('#fff');
            background.attemptedColor('#aabbcc');

            background.pickColor();

            expect(background.color()).toEqual('#aabbcc');
        });

        it('should unselect texture', () => {
            let popover = new BackgroundPopover();
            popover.color('#fff');
            popover.attemptedColor('#aabbcc');
            popover.texture('texture');

            popover.pickColor();

            expect(popover.texture()).toEqual(null);
        });

        it(`should trigger event ${EVENT_COLOR_SELECTED}`, () => {
            let popover = new BackgroundPopover();
            popover.color('#fff');
            popover.attemptedColor('#aabbcc');
            spyOn(popover, 'trigger');

            popover.pickColor();

            expect(popover.trigger).toHaveBeenCalledWith(EVENT_COLOR_SELECTED, '#aabbcc');
        });

        it('should hide color picker', () => {
            let popover = new BackgroundPopover();
            popover.isColorPickerVisible(true);
            popover.color('#fff');
            popover.attemptedColor('#aabbcc');

            popover.pickColor();

            expect(popover.isColorPickerVisible()).toBeFalsy();
        });

    });

    describe('selectColor:', () => {

        it('should select color', () => {
            let background = new BackgroundPopover();
            background.color('#fff');

            background.selectColor('#aabbcc');

            expect(background.color()).toEqual('#aabbcc');
        });

        it('should unselect texture', () => {
            let background = new BackgroundPopover();
            background.texture('texture');

            background.selectColor('#aabbcc');

            expect(background.texture()).toEqual(null);
        });

        it(`should trigger event ${EVENT_COLOR_SELECTED}`, () => {
            let background = new BackgroundPopover();
            spyOn(background, 'trigger');

            background.selectColor('#aabbcc');

            expect(background.trigger).toHaveBeenCalledWith(EVENT_COLOR_SELECTED, '#aabbcc');
        });
    });

    describe('textures:', () => {
        
        it('should be an observable array', () => {
            let background = new BackgroundPopover();
            expect(background.textures).toBeObservableArray();
        });

    });

    describe('texture:', () => {
       
        it('should be observable', () => {
            let background = new BackgroundPopover();
            expect(background.texture).toBeObservable();
        });

    });

    describe('selectTexture:', () => {

        it('should select texture', () => {
            let background = new BackgroundPopover();
            background.texture(null);

            background.selectTexture('texture');

            expect(background.texture()).toEqual('texture');
        });

        it('should unselect color', () => {
            let background = new BackgroundPopover();
            background.color('#aabbcc');

            background.selectTexture('texture');

            expect(background.color()).toEqual(null);
        });

        it(`should trigger event ${EVENT_TEXTURE_SELECTED}`, () => {
            let background = new BackgroundPopover();
            spyOn(background, 'trigger');

            background.selectTexture('texture');

            expect(background.trigger).toHaveBeenCalledWith(EVENT_TEXTURE_SELECTED, 'texture');
        });
    });

    describe('upload:', () => {
        
        it('should be function', () => {
            let background = new BackgroundPopover();

            expect(background.upload).toBeFunction();
        });

        describe('when file is not an object', () => {

            it('should reject promise', done => {
                let background = new BackgroundPopover();
                background.upload().catch(() => {
                    done();
                });
            });

        });

        describe('when file is defined', () => {

            it('should send file to server', done => {
                spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve({ url: 'imageUrl' }));

                let background = new BackgroundPopover();
                background.upload({}).then(() => {
                    expect(imageUpload.v2).toHaveBeenCalled();
                    done();
                });
            });

            describe('and file is uploaded successfully', () => {

                beforeEach(() => spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve({ url: 'textureUrl' })));

                it('should resolve promise', done => {
                    let background = new BackgroundPopover();
                    background.upload({}).then(() => {
                        done();
                    });
                });

                it('should set texture', done => {
                    let background = new BackgroundPopover();
                    background.texture('');
                    background.upload({}).then(() => {
                        expect(background.texture()).toEqual('textureUrl');
                        done();
                    });
                });

                it('should unselect color', done => {
                    let background = new BackgroundPopover();
                    background.color('#aabbcc');

                    background.upload({}).then(() => {
                        expect(background.color()).toEqual(null);
                        done();
                    });
                });

                it(`should trigger event ${EVENT_TEXTURE_SELECTED}`, done => {
                    let background = new BackgroundPopover();
                    spyOn(background, 'trigger');

                    background.upload({}).then(() => {
                        expect(background.trigger).toHaveBeenCalledWith(EVENT_TEXTURE_SELECTED, 'textureUrl');
                        done();
                    });
                });

            });

            describe('and failed to upload file', () => {

                beforeEach(() => {
                    spyOn(imageUpload, 'v2').and.returnValue(Promise.reject('reason'));
                    spyOn(notify, 'error');
                });

                it('should resolve promise', done => {
                    let background = new BackgroundPopover();
                    background.upload({}).then(() => {
                        done();
                    });
                });

                it('should show notification', done => {
                    let background = new BackgroundPopover();
                    background.upload({}).then(() => {
                        expect(notify.error).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });

    });

    describe('show:', () => {
        
        it('should set isVisible to true', () => {
            let popover = new BackgroundPopover();
            popover.show();
            expect(popover.isVisible()).toBeTruthy();
        });

    });

});