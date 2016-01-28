import imageUpload from 'imageUpload';
import notify from 'notify';

import eventTracker from 'eventTracker';

import { LogoPopover } from './LogoPopover';
import { EVENT_LOGO_CHANGED } from './Logo';


describe('Logo popover section', () => {
    
    beforeEach(() => {
        spyOn(eventTracker, 'publish');
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

    describe('upload', () => {
        
        it('should be function', () => {
            let logoPopover = new LogoPopover();
            expect(logoPopover.upload).toBeFunction();
        });

        describe('when file is not object', () => {
            
            it('should reject promise', done => {
                let logoPopover = new LogoPopover();
                logoPopover.upload().catch(() => {
                    done();
                });
            });
        
        });

        describe('when file is defined', () => {
            
            it('should send file to server', done => {
                spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve({ url: 'imageUrl' }));

                let logoPopover = new LogoPopover();
                logoPopover.upload({}).then(() => {
                    expect(imageUpload.v2).toHaveBeenCalled();
                    done();
                });
            });

            describe('and file is uploaded successfully', () => {
            
                beforeEach(() => spyOn(imageUpload, 'v2').and.returnValue(Promise.resolve({ url: 'imageUrl' })));

                it('should resolve promise', done => {
                    let logoPopover = new LogoPopover();
                    logoPopover.upload({}).then(() => {
                        done();
                    });
                });

                it('should call updateLogo function', done => {
                    let logoPopover = new LogoPopover();
                    spyOn(logoPopover, 'updateLogo');
                    logoPopover.upload({}).then(() => {
                        expect(logoPopover.updateLogo).toHaveBeenCalledWith('imageUrl');
                        done();
                    });
                });
            
            });

            describe('and failed to upload file', () => {
            
                beforeEach(() => {
                    spyOn(imageUpload, 'v2').and.returnValue(Promise.reject('reason'));
                    spyOn(notify, 'error');
                });
            
                it('should show notification', done => {
                    let logoPopover = new LogoPopover();
                    logoPopover.upload({}).then(() => {
                        expect(notify.error).toHaveBeenCalled();
                        done();
                    });
                
                });

            });

        });

    });

});