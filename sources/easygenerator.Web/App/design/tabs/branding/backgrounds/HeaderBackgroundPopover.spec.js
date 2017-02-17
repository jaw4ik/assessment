import { HeaderPopover, IMAGE_MODE, COLOR_MODE, EVENT_IMAGE_SELECTED, EVENT_COLOR_SELECTED } from './HeaderBackgroundPopover.js';

import notify from 'notify';
import uploadImage from 'images/commands/upload';

describe('Background header popover', () => {

    beforeEach(() => {
        spyOn(notify, 'saved');
        spyOn(notify, 'error');
    });

    it('should include publish/subscribe', () => {
        let headerPopover = new HeaderPopover();
        expect(headerPopover.on).toBeFunction();
        expect(headerPopover.trigger).toBeFunction();
    });

    describe('isVisible:', () => {

        it('should be observable', () => {
            let headerPopover = new HeaderPopover();
            expect(headerPopover.isVisible).toBeObservable();
        });

    });

    describe('colors:', () => {

        it('should be an observable array', () => {
            let popover = new HeaderPopover();
            expect(popover.colors).toBeObservableArray();
        });

    });

    describe('color:', () => {

        it('should be observable', () => {
            let popover = new HeaderPopover();
            expect(popover.color).toBeObservable();
        });

    });

    describe('mode:', () => {

        it('should be observable', () => {
            let popover = new HeaderPopover();
            expect(popover.mode).toBeObservable();
        });

        it(`should be '${IMAGE_MODE}' by default`, () => {
            let popover = new HeaderPopover();
            expect(popover.mode()).toEqual(IMAGE_MODE);
        });
    });

    describe('isColorMode:', () => {

        it('should be computed', () => {
            let popover = new HeaderPopover();
            expect(popover.isColorMode).toBeComputed();
        });

        describe(`when mode is ${COLOR_MODE}`, () => {

            it('should return true', () => {
                let popover = new HeaderPopover();
                popover.mode(COLOR_MODE);

                expect(popover.isColorMode()).toBeTruthy();
            });

        });

    });

    describe('isImageMode:', () => {

        it('should be computed', () => {
            let popover = new HeaderPopover();
            expect(popover.isImageMode).toBeComputed();
        });

        describe(`when mode is ${IMAGE_MODE}`, () => {

            it('should return true', () => {
                let popover = new HeaderPopover();
                popover.mode(IMAGE_MODE);

                expect(popover.isImageMode()).toBeTruthy();
            });

        });

    });

    describe('toColorMode:', () => {

        it(`should set mode to ${COLOR_MODE}`, () => {
            let background = new HeaderPopover();
            background.mode(IMAGE_MODE);

            background.toColorMode();

            expect(background.mode()).toEqual(COLOR_MODE);
        });

    });

    describe('toImageMode:', () => {

        it(`should set mode to ${IMAGE_MODE}`, () => {
            let popover = new HeaderPopover();
            popover.mode(COLOR_MODE);

            popover.toImageMode();

            expect(popover.mode()).toEqual(IMAGE_MODE);
        });

    });

    describe('isColorPickerVisible', () => {

        it('should be observable', () => {
            let popover = new HeaderPopover();
            expect(popover.isColorPickerVisible).toBeObservable();
        });

    });

    describe('showColorPicker:', () => {

        it('should show colorpicker', () => {
            let popover = new HeaderPopover();
            popover.isColorPickerVisible(false);
            popover.showColorPicker();
            expect(popover.isColorPickerVisible()).toBeTruthy();
        });

    });

    describe('hideColorPicker:', () => {

        it('should hide colorpicker', () => {
            let popover = new HeaderPopover();
            popover.isColorPickerVisible(true);
            popover.hideColorPicker();
            expect(popover.isColorPickerVisible()).toBeFalsy();
        });

    });

    describe('attemptedColor:', () => {

        it('should be observable', () => {
            let popover = new HeaderPopover();
            expect(popover.attemptedColor).toBeObservable();
        });

    });

    describe('pickColor:', () => {

        it('should pick current color picker color as the selected one', () => {
            let popover = new HeaderPopover();
            popover.color('#fff');
            popover.attemptedColor('#aabbcc');

            popover.pickColor();

            expect(popover.color()).toEqual('#aabbcc');
        });

        it('should unselect image', () => {
            let popover = new HeaderPopover();
            popover.color('#fff');
            popover.attemptedColor('#aabbcc');
            popover.image('image');

            popover.pickColor();

            expect(popover.image()).toEqual(null);
        });

        it(`should trigger event ${EVENT_COLOR_SELECTED}`, () => {
            let popover = new HeaderPopover();
            popover.color('#fff');
            popover.attemptedColor('#aabbcc');
            spyOn(popover, 'trigger');

            popover.pickColor();

            expect(popover.trigger).toHaveBeenCalledWith(EVENT_COLOR_SELECTED, '#aabbcc');
        });

        it('should hide color picker', () => {
            let popover = new HeaderPopover();
            popover.isColorPickerVisible();
            popover.color('#fff');
            popover.attemptedColor('#aabbcc');

            popover.pickColor();

            expect(popover.isColorPickerVisible()).toBeFalsy();
        });

    });

    describe('selectColor:', () => {

        it('should select color', () => {
            let popover = new HeaderPopover();
            popover.color('#fff');

            popover.selectColor('#aabbcc');

            expect(popover.color()).toEqual('#aabbcc');
        });

        it('should unselect image', () => {
            let popover = new HeaderPopover();
            popover.image('image');

            popover.selectColor('#aabbcc');

            expect(popover.image()).toEqual(null);
        });

        it(`should trigger event ${EVENT_COLOR_SELECTED}`, () => {
            let popover = new HeaderPopover();
            spyOn(popover, 'trigger');

            popover.selectColor('#aabbcc');

            expect(popover.trigger).toHaveBeenCalledWith(EVENT_COLOR_SELECTED, '#aabbcc');
        });
    });

    describe('images:', () => {

        it('should be an observable array', () => {
            let background = new HeaderPopover();
            expect(background.images).toBeObservableArray();
        });

    });

    describe('texture:', () => {

        it('should be observable', () => {
            let popover = new HeaderPopover();
            expect(popover.image).toBeObservable();
        });

    });

    describe('selectImage:', () => {

        it('should select image', () => {
            let popover = new HeaderPopover();
            popover.image(null);

            popover.selectImage('image');

            expect(popover.image()).toEqual('image');
        });

        it('should unselect color', () => {
            let popover = new HeaderPopover();
            popover.color('#aabbcc');

            popover.selectImage('image');

            expect(popover.color()).toEqual(null);
        });

        it(`should trigger event ${EVENT_IMAGE_SELECTED}`, () => {
            let popover = new HeaderPopover();
            spyOn(popover, 'trigger');

            popover.selectImage('image');

            expect(popover.trigger).toHaveBeenCalledWith(EVENT_IMAGE_SELECTED, 'image');
        });

    });

    describe('upload:', () => {

        let popover;

        beforeEach(() => {
            popover = new HeaderPopover();
        });

        describe('and when image uploading successfull', () => {

            let uploadImagePromise;
            let file;
            let imageUploadRes;

            beforeEach(() => {
                file = 'some image file';
                imageUploadRes = {
                    id: 'someid',
                    title: 'title',
                    url: 'https://urla.com'
                };
                uploadImagePromise = Promise.resolve(imageUploadRes);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should upload image to image storage', () => {
                popover.upload(file);
                expect(uploadImage.execute).toHaveBeenCalledWith(file);
            });

            it('should update logo', done => (async () => {
                spyOn(popover, 'selectImage');
                popover.upload(file);
                await uploadImagePromise;
                expect(popover.selectImage).toHaveBeenCalledWith(imageUploadRes.url);
            })().then(done));

            it('should show saved notification', done => (async () => {
                popover.upload(file);
                await uploadImagePromise;
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));
        });

        describe('and when image uploading failed', () => {
                
            let uploadImagePromise;
            let file;
            let reason;

            beforeEach(() => {
                file = 'some image file';
                reason = 'some reject reason';
                uploadImagePromise = Promise.reject(reason);
                spyOn(uploadImage, 'execute').and.returnValue(uploadImagePromise);
            });

            it('should show notify error message', done => (async () => {
                try {
                    popover.upload(file);
                    await uploadImagePromise;
                } catch (e) {
                    expect(notify.error).toHaveBeenCalledWith(reason);
                    expect(e).toBe(reason);
                } 
            })().then(done));

        });

    });

    describe('show:', () => {
        
        it('should set isVisible to true', () => {
            let popover = new HeaderPopover();
            popover.show();
            expect(popover.isVisible()).toBeTruthy();
        });

    });

});