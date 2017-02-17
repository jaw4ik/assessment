import { BackgroundPopover, COLOR_MODE, TEXTURE_MODE, EVENT_TEXTURE_SELECTED, EVENT_COLOR_SELECTED } from './BodyBackgroundPopover.js';

import notify from 'notify';
import uploadImage from 'images/commands/upload';

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

        let uploadImagePromise;
        let imageResult;
        let background;

        beforeEach(() => {
            background = new BackgroundPopover();
            imageResult = {
                id: 'id',
                title: 'image.png',
                url: 'https://urlko.com'
            };
        });

        it('should send image to server', () => {
            spyOn(uploadImage, 'execute');
            background.upload('file');
            expect(uploadImage.execute).toHaveBeenCalledWith('file');
        });

        describe('when image is uploaded successfully', () => {

            beforeEach(() => {
                uploadImagePromise = Promise.resolve(imageResult);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should update texture', done => (async () => {
                background.upload();
                await uploadImagePromise;
                expect(background.texture()).toBe(imageResult.url);
            })().then(done));

        });

        describe('when image is not uploaded successfully', () => {

            let reason;

            beforeEach(() => {
                reason = 'some reason';
                uploadImagePromise = Promise.reject(reason);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should show error message', done => (async () => {
                try {
                    spyOn(notify, 'error');
                    background.upload();
                    await uploadImagePromise;
                } catch (e) {
                    expect(notify.error).toHaveBeenCalledWith(reason);
                }
            })().then(done));

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