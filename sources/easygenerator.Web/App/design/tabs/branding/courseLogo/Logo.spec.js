import Logo from './Logo';
import { URL_MODE, UPLOAD_MODE, EVENT_LOGO_CHANGED, EVENT_LOGO_REMOVED } from './Logo';
import bus from 'design/bus';
import imageUpload from 'imageUpload';
import notify from 'notify';
import eventTracker from 'eventTracker';
import userContext from 'userContext';
import localizationManager from 'localization/localizationManager';

describe('Logo design section', () => {

    beforeEach(() => {
        spyOn(bus, 'trigger');
        spyOn(eventTracker, 'publish');
        spyOn(localizationManager, 'localize').and.returnValue('localized');
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

        describe('when edit is allowed', () => {
            it('should set allowEdit true', () =>{
                let logo = new Logo();
                logo.activate(null, null, true);

                expect(logo.allowEdit).toBeTruthy();
            });

        });

        describe('when edit is not allowed', () => {
            it('should set allowEdit false', () =>{
                let logo = new Logo();
                logo.activate(null, null, false);

                expect(logo.allowEdit).toBeFalsy();
            });

        });
    });

    describe('updateLogo', () => {
    
        it('should be function', () => {
            let logo = new Logo();
            expect(logo.updateLogo).toBeFunction();
        });

        it('should change imageUrl', () => {
            let logo = new Logo();
            logo.imageUrl('url');
            let url = 'new Url';

            logo.updateLogo(url);
            expect(logo.imageUrl()).toEqual(url);
        });

        describe('when user uploads logo image', () => {
        
            it(`should trigger event ${EVENT_LOGO_CHANGED}`, () => {
                let logo = new Logo();
                let url = 'new Url';

                logo.updateLogo(url);
                expect(bus.trigger).toHaveBeenCalledWith(EVENT_LOGO_CHANGED);
            });

        });

    });

});