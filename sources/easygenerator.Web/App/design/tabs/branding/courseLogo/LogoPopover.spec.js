import uploadImage from 'images/commands/upload';
import notify from 'notify';

import eventTracker from 'eventTracker';

import { LogoPopover } from './LogoPopover';
import { EVENT_LOGO_CHANGED } from './Logo';


describe('Logo popover section', () => {
    
    beforeEach(() => {
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'saved');
        spyOn(notify, 'error');
    });

    it('should create logo popover object', () => {
        let logoPopover = new LogoPopover();
        expect(logoPopover.imageUrl()).not.toBeDefined();
    });

    describe('isVisible', () =>{
        
        it('should be observable', () => {
            let logoPopover = new LogoPopover();
            expect(logoPopover.isVisible).toBeObservable();
        });

        it('should be false', ()=>{
            let logoPopover = new LogoPopover();
            expect(logoPopover.isVisible()).toBeFalsy();
        });

    });

    describe('imageUrl:', () =>{
        
        it('should be observable', () => {
            let logoPopover = new LogoPopover();
            expect(logoPopover.imageUrl).toBeObservable();
        });

        describe('endEdit:', () => {
            
            it(`it should trigger event ${EVENT_LOGO_CHANGED}`, () => {
                let logoPopover = new LogoPopover();
                spyOn(logoPopover, 'trigger');

                logoPopover.imageUrl('url');
                logoPopover.imageUrl.endEdit();
                expect(logoPopover.trigger).toHaveBeenCalledWith(EVENT_LOGO_CHANGED, logoPopover.imageUrl());
            })

            it('it should trigger event "Change logo (link)"', () => {
                let logoPopover = new LogoPopover();
                
                logoPopover.imageUrl('url');
                logoPopover.imageUrl.endEdit();
                expect(eventTracker.publish).toHaveBeenCalledWith('Change logo (link)');
            });
        
        });
       
    });

    describe('updateLogo', () => {
           
        it('should change imageUrl', () => {
            let url = 'url';
            let logoPopover = new LogoPopover();
            logoPopover.updateLogo(url);
            
            expect(logoPopover.imageUrl()).toEqual(url);
        });
        
        it(`should trigger event ${EVENT_LOGO_CHANGED}`, () => {
            let url = 'url';
            let logoPopover = new LogoPopover();
            spyOn(logoPopover, 'trigger');
            
            logoPopover.updateLogo(url);
            expect(logoPopover.trigger).toHaveBeenCalledWith(EVENT_LOGO_CHANGED, url);
        });
        
    });

    describe('upload:', () => {

        let logoPopover;

        beforeEach(() => {
            logoPopover = new LogoPopover();
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
                logoPopover.upload(file);
                expect(uploadImage.execute).toHaveBeenCalledWith(file);
            });

            it('should update logo', done => (async () => {
                spyOn(logoPopover, 'updateLogo');
                logoPopover.upload(file);
                await uploadImagePromise;
                expect(logoPopover.updateLogo).toHaveBeenCalledWith(imageUploadRes.url);
            })().then(done));

            it('should send event \'Change logo (upload)\'', done => (async () => {
                logoPopover.upload(file);
                await uploadImagePromise;
                expect(eventTracker.publish).toHaveBeenCalledWith('Change logo (upload)');
            })().then(done));

            it('should show saved notification', done => (async () => {
                logoPopover.upload(file);
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
                    logoPopover.upload(file);
                    await uploadImagePromise;
                } catch (e) {
                    expect(notify.error).toHaveBeenCalledWith(reason);
                    expect(e).toBe(reason);
                } 
            })().then(done));

        });

    });

});