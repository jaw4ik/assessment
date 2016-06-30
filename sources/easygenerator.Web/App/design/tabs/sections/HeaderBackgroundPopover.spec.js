import { HeaderPopover, IMAGE_MODE, COLOR_MODE, EVENT_IMAGE_SELECTED, EVENT_COLOR_SELECTED } from './HeaderBackgroundPopover.js';

import notify from 'notify';
import imageUpload from 'imageUpload';

describe('Background header popover', () => {

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

        it('should be function', () => {
            let popover = new HeaderPopover();

            expect(popover.upload).toBeFunction();
        });

        describe('when file is not an object', () => {

            it('should reject promise', done => {
                let popover = new HeaderPopover();
                popover.upload().catch(reason => {
                    expect(reason).toEqual('File was not provided.');
                    done();
                });
            });

        });

        describe('when file is defined', () => {

            it('should send file to server', done => {
                spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve({ url: 'imageUrl' }));

                let popover = new HeaderPopover();
                popover.upload({}).then(() => {
                    expect(imageUpload.v2).toHaveBeenCalled();
                    done();
                });
            });

            describe('and file is uploaded successfully', () => {

                beforeEach(() => spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve({ url: 'imageUrl' })));

                it('should resolve promise', done => {
                    let popover = new HeaderPopover();
                    popover.upload({}).then(imageUrl => {
                        expect(imageUrl).toEqual('imageUrl');
                        done();
                    });
                });

                it('should set image', done => {
                    let popover = new HeaderPopover();
                    popover.image('');
                    popover.upload({}).then(() => {
                        expect(popover.image()).toEqual('imageUrl');
                        done();
                    });
                });

                it('should unselect color', done => {
                    let popover = new HeaderPopover();
                    popover.color('#aabbcc');

                    popover.upload({}).then(() => {
                        expect(popover.color()).toEqual(null);
                        done();
                    });
                });

                it(`should trigger event ${EVENT_IMAGE_SELECTED}`, done => {
                    let popover = new HeaderPopover();
                    spyOn(popover, 'trigger');

                    popover.upload({}).then(() => {
                        expect(popover.trigger).toHaveBeenCalledWith(EVENT_IMAGE_SELECTED, 'imageUrl');
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
                    let popover = new HeaderPopover();
                    popover.upload({}).then(() => {
                        expect(arguments.length).toEqual(0);
                        done();
                    });
                });

                it('should show notification', done => {
                    let popover = new HeaderPopover();
                    popover.upload({}).then(() => {
                        expect(notify.error).toHaveBeenCalled();
                        done();
                    });
                });

            });

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