import FontsTab from './FontsTab.js';

import fonts from 'fonts';
import userContext from 'userContext';


describe('Fonts tab', () => {
    describe('name:', () => {

        it('should be defined', () => {
            let tab = new FontsTab();
            expect(tab.name).toEqual('fonts');
        });

    });

    describe('title:', () => {

        it('should be defined', () => {
            let tab = new FontsTab();
            expect(tab.name).toEqual('fonts');
        });

    });

    describe('type:', () => {

        it('should be \'default\'', () => {
            let tab = new FontsTab();
            expect(tab.type).toEqual('default');
        });

    });

    describe('isSelected:', () => {

        it('should be observable', () => {
            let tab = new FontsTab();
            expect(tab.isSelected).toBeObservable();
        });

    });

    describe('expand:', () => {

        it('should expand section', () => {
            let tab = new FontsTab();
            tab.contentStyles.expanded(false);
            tab.expand(tab.contentStyles);
            expect(tab.contentStyles.expanded()).toBeTruthy();
        });

        it('should collapse other sections', () => {
            let tab = new FontsTab();
            tab.contentStyles.expanded(true);
            tab.expand(tab.contentStyles);
            expect(tab.generalStyles.expanded()).toBeFalsy();
        });

    });

    describe('activate:', () => {
        
        it('should activate general tab', done =>{
            
            let tab = new FontsTab();

            let settings = { 
                fonts: [],
                branding: {
                    colors:[]
                }
            };
            let defaults = {fonts: [] };
            
            spyOn(tab.generalStyles, 'activate');

            tab.activate(settings, defaults).then(() => {
                expect(tab.generalStyles.activate).toHaveBeenCalledWith(settings, defaults);
                done();
            });

        });

        it('should activate content tab', done =>{
            
            let tab = new FontsTab();

            let settings = { 
                fonts: [],
                branding: {
                    colors:[]
                }
            };
            let defaults = {fonts: [] };
            
            spyOn(tab.contentStyles, 'activate');

            tab.activate(settings, defaults).then(() => {
                expect(tab.contentStyles.activate).toHaveBeenCalledWith(settings, defaults);
                done();
            });

        });

        it('should load font families', done =>{
            spyOn(fonts, 'load');
            let tab = new FontsTab();

            let settings = { 
                fonts: [],
                branding: {
                    colors:[]
                }
            };
            let defaults = {fonts: [] };

            tab.activate(settings, defaults).then(() => {
                expect(fonts.load).toHaveBeenCalledWith(["Bad Script", "Ledger", "PT Sans", "PT Serif", "Roboto", "Roboto Mono", "Roboto Slab"]);
                done();
            });

        });

        it('should set show fonts tab content', done =>{
        
            let tab = new FontsTab();

            let settings = { 
                fonts: [],
                branding: {
                    colors:[]
                }
            };
            let defaults = {fonts: [] };

            tab.activate(settings, defaults).then(() => {
                expect(tab.isLoadingSettings()).toBeFalsy();
                done();
            });

        });

        
        describe('when user has Plus plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
            });

            it('should set available true', done =>{

                let tab = new FontsTab();
                let settings = { 
                    fonts: [],
                    branding: {
                        colors:[]
                    }
                };
                let defaults = {fonts: [] };
                tab.activate(settings, defaults).then(() => {
                    expect(tab.available).toBeTruthy();
                    done();
                });
        
            });

        });

        describe('when user doesn`t have  Plus plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
            });

            it('should set available false', done =>{

                let tab = new FontsTab();
                let settings = { 
                    fonts: [],
                    branding: {
                        colors:[]
                    }
                };
                let defaults = {fonts: [] };
                tab.activate(settings, defaults).then(() => {
                    expect(tab.available).toBeFalsy();
                    done();
                });
        
            });
        
        });
    
    });

})
