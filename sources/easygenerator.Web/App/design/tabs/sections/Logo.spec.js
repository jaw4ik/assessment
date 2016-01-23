import Logo from './Logo';
import { URL_MODE, UPLOAD_MODE, EVENT_LOGO_UPLOADED, EVENT_LOGO_CHANGED, EVENT_LOGO_REMOVED } from './Logo';

import bus from './../../bus.js';
import imageUpload from 'imageUpload';
import notify from 'notify';
import eventTracker from 'eventTracker';
import userContext from 'userContext';

describe('Logo design section', () => {

    beforeEach(() => {
        spyOn(bus, 'trigger');
        spyOn(eventTracker, 'publish');
    });

    it('should create logo object', () => {
        let logo = new Logo();
        expect(logo.title).toBeDefined();
        expect(logo.imageUrl()).not.toBeDefined();
    });


    describe('expanded:', () => {
        it('should be observable', () => {
            let logo = new Logo();
            expect(logo.expanded).toBeObservable();
        });
    });

    describe('toggleExpanded:', () => {
        it('should change expanded state', () => {
            let logo = new Logo();
            logo.expanded(false);

            logo.toggleExpanded();

            expect(logo.expanded()).toBeTruthy();
        });
    });

    describe('imageUrl:', () => {

        it('should be observable', () => {
            let logo = new Logo();
            expect(logo.imageUrl).toBeObservable();
        });
        
        describe('endEdit:', () => {
        
            it(`should trigger event ${EVENT_LOGO_CHANGED}`, () => {
                let logo = new Logo();
                logo.imageUrl('url');
                logo.imageUrl.endEdit();
                expect(bus.trigger).toHaveBeenCalledWith(EVENT_LOGO_CHANGED);
            });

            it(`should trigger event 'Change logo (link)'`, () => {
                let logo = new Logo();
                logo.imageUrl('url');
                logo.imageUrl.endEdit();
                expect(eventTracker.publish).toHaveBeenCalledWith('Change logo (link)');
            });

        });

        describe('isDefault:', () => {

            it('should be computed', () => {
                let logo = new Logo();
                expect(logo.imageUrl.isDefault).toBeComputed();
            });

            describe('when defaults have image url', () => {

                describe('and current imageUrl is the same', () => {

                    it('should return true', () => {
                        let logo = new Logo();
                        logo.defaults = { url: 'url' };
                        logo.imageUrl('url');

                        expect(logo.imageUrl.isDefault()).toBeTruthy();
                    });

                });

                describe('and current imageUrl is not the same', () => {

                    it('should  return false', () => {
                        let logo = new Logo();
                        logo.defaults = { url: 'URL' };
                        logo.imageUrl('url');

                        expect(logo.imageUrl.isDefault()).toBeFalsy();
                    });

                });

            });

            describe('when imageUrl is not defined', () => {

                it('should return false', () => {
                    let logo = new Logo();
                    logo.defaults = { url: 'URL' };

                    expect(logo.imageUrl.isDefault()).toBeFalsy();
                });

            });

            describe('when defaults are not defined', () => {
                
                it('should return false', () => {
                    let logo = new Logo();
                    logo.defaults = null;

                    expect(logo.imageUrl.isDefault()).toBeFalsy();
                });

            });

        });

    });

    describe('mode:', () => {

        it('should be observable', () => {
            let logo = new Logo();
            expect(logo.mode).toBeObservable();
        });

        it(`should be ${UPLOAD_MODE} by default`, () => {
            let logo = new Logo();
            expect(logo.mode()).toEqual(UPLOAD_MODE);
        });
    });

    describe('isUploadMode:', () => {

        it('should be computed', () => {
            let logo = new Logo();
            expect(logo.isUploadMode).toBeComputed();
        });

        describe(`when mode is ${UPLOAD_MODE}`, () => {

            it('should return true', () => {
                let logo = new Logo();
                logo.mode(UPLOAD_MODE);

                expect(logo.isUploadMode()).toBeTruthy();
            });

        });

    });

    describe('isURLMode:', () => {

        it('should be computed', () => {
            let logo = new Logo();
            expect(logo.isURLMode).toBeComputed();
        });

        describe(`when mode is ${URL_MODE}`, () => {

            it('should return true', () => {
                let logo = new Logo();
                logo.mode(URL_MODE);

                expect(logo.isURLMode()).toBeTruthy();
            });

        });

    });

    describe('toUploadMode:', () => {

        it(`should set mode to ${UPLOAD_MODE}`, () => {
            let logo = new Logo();
            logo.mode(URL_MODE);

            logo.toUploadMode();

            expect(logo.mode()).toEqual(UPLOAD_MODE);
        });

    });

    describe('toURLMode:', () => {

        it(`should set mode to ${URL_MODE}`, () => {
            let logo = new Logo();
            logo.mode(UPLOAD_MODE);

            logo.toURLMode();

            expect(logo.mode()).toEqual(URL_MODE);
        });

    });


    describe('upload:', () => {

        it('should be function', () => {
            let logo = new Logo();
            expect(logo.upload).toBeFunction();
        });

        describe('when file is not an object', () => {

            it('should reject promise', done => {
                let logo = new Logo();
                logo.upload().catch(() => {
                    done();
                });
            });

        });

        describe('when file is defined', () => {

            it('should send file to server', done => {
                spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve({ url: 'imageUrl' }));

                let logo = new Logo();
                logo.upload({}).then(() => {
                    expect(imageUpload.v2).toHaveBeenCalled();
                    done();
                });
            });

            describe('and file is uploaded successfully', () => {

                beforeEach(() => spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve({ url: 'imageUrl' })));

                it('should resolve promise', done => {
                    let logo = new Logo();
                    logo.upload({}).then(() => {
                        done();
                    });
                });

                it('should set imageUrl', done => {
                    let logo = new Logo();
                    logo.imageUrl('');
                    logo.upload({}).then(() => {
                        expect(logo.imageUrl()).toEqual('imageUrl');
                        done();
                    });
                });

                it(`should trigger event ${EVENT_LOGO_UPLOADED}`, done => {
                    let logo = new Logo();
                    logo.imageUrl('');
                    logo.upload({}).then(() => {
                        expect(bus.trigger).toHaveBeenCalledWith(EVENT_LOGO_UPLOADED);
                        done();
                    });
                });

                it(`should trigger event 'Change logo (upload)'`, done => {
                    let logo = new Logo();
                    logo.imageUrl('');
                    logo.upload({}).then(() => {
                        expect(eventTracker.publish).toHaveBeenCalledWith('Change logo (upload)');
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
                    let logo = new Logo();
                    logo.upload({}).then(() => {
                        done();
                    });
                });

                it('should show notification', done => {
                    let logo = new Logo();
                    logo.upload({}).then(() => {
                        expect(notify.error).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });

    });

    describe('remove:', () => {

        describe('when defaults have image url', () => {

            it('should set a default value to imageUrl', () => {
                let logo = new Logo();
                logo.defaults = { url: 'url' };
                logo.imageUrl('URL');

                logo.remove();

                expect(logo.imageUrl()).toEqual('url');
            });

        });

        describe('when defaults do not have image url', () => {
           
            it('should reset imageUrl', () => {
                let logo = new Logo();
                logo.defaults = {};
                logo.imageUrl('imageUrl');

                logo.remove();

                expect(logo.imageUrl()).toEqual(null);
            });

        });

        it(`should trigger event ${EVENT_LOGO_REMOVED}`, () => {
            let logo = new Logo();
            logo.remove();
            expect(bus.trigger).toHaveBeenCalledWith(EVENT_LOGO_REMOVED);
        });

    });

    describe('activate:', () => {
        
        it('should set imageUrl', () => {
            let logo = new Logo();

            logo.activate({
                url: 'imageUrl'
            });

            expect(logo.imageUrl()).toEqual('imageUrl');
        });

        it('should set defaults', () => {
            let logo = new Logo();
            let defaults = {}

            logo.activate({ url: 'imageUrl' }, defaults);

            expect(logo.defaults).toEqual(defaults);
        });

        describe('when logo is not an object', () => {

            describe('and defaults have image url', () => {

                it('should set a default value to imageUrl', () => {
                    let logo = new Logo();

                    logo.activate(null, { url: 'imageUrl' });

                    expect(logo.imageUrl()).toEqual('imageUrl');
                });

            });

            describe('and defaults do not have image url', () => {

                it('should set null to imageUrl', () => {
                    let logo = new Logo();

                    logo.activate();

                    expect(logo.imageUrl()).toEqual(null);
                });

            });

        });

        describe('when defaults are not defined', () => {

            it('should set null to defaults', () => {
                let logo = new Logo();

                logo.activate();

                expect(logo.defaults).toEqual(null);
            });

        });

        describe('when user has Starter plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
            });

            it('should set available true', () =>{

                let logo = new Logo();
                logo.activate();

                expect(logo.available).toBeTruthy();
        
            });

        });

        describe('when user doesn`t have  Starter plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
            });

            it('should set available false', () =>{

                let logo = new Logo();
                logo.activate();

                expect(logo.available).toBeFalsy();
            });

        });

    });

});