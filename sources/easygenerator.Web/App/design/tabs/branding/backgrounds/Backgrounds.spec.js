import Backgrounds from './Backgrounds';

import userContext from 'userContext';

import HeaderBackground from './HeaderBackground';
import BodyBackground from './BodyBackground';


import {
    BACKGROUND_IMAGE_FULLSCREEN,
    BACKGROUND_IMAGE_REPEAT,
    BACKGROUND_IMAGE_ORIGINAL,

    EVENT_HEADER_BACKGROUND_EXPANDED_CHANGED,
    EVENT_HEADER_BACKGROUND_IMAGE_CHANGED,
    EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED,
    EVENT_HEADER_BACKGROUND_COLOR_CHANGED,
    EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED,
    EVENT_BODY_BACKGROUND_TEXTURE_CHANGED,
    EVENT_BODY_BACKGROUND_COLOR_CHANGED,
    EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED
} from './Backgrounds';

import bus from 'design/bus';

let describe = window.describe;
let it = window.it;
let expect = window.expect;
let beforeEach = window.beforeEach;
let spyOn = window.spyOn;

describe('Backgrounds design section', () => {

    beforeEach(() => {
        spyOn(bus, 'trigger');
    });

    it('should create an backgrounds section object', () => {
        let backgrounds = new Backgrounds();
        expect(backgrounds.title).toBeDefined();
    });

    describe('expanded:', () => {

        it('should be observable', () => {
            let backgrounds = new Backgrounds();
            expect(backgrounds.expanded).toBeObservable();
        });

    });

    describe('toggleExpanded:', () => {

        it('should change expanded state', () => {
            let backgrounds = new Backgrounds();
            backgrounds.expanded(false);

            backgrounds.toggleExpanded();

            expect(backgrounds.expanded()).toBeTruthy();
        });

    });

    describe('header:', () => {

        it('should be defined', () => {
            let backgrounds = new Backgrounds();

            expect(backgrounds.header).toBeInstanceOf(HeaderBackground);
        });

    });

    describe('body:', () => {

        it('should be object', () => {
            let backgrounds = new Backgrounds();

            expect(backgrounds.body).toBeInstanceOf(BodyBackground);
        });


    });

    describe('activate:', () => {

        describe('when settings are not defined', () => {

            it('should activate header', () => {
                let backgrounds = new Backgrounds();
                spyOn(backgrounds.header, 'activate');
                spyOn(backgrounds.body, 'activate');

                backgrounds.activate();

                expect(backgrounds.header.activate).toHaveBeenCalledWith(null, null);
            });

            it('should activate body', () => {
                let backgrounds = new Backgrounds();
                spyOn(backgrounds.header, 'activate');
                spyOn(backgrounds.body, 'activate');

                backgrounds.activate();

                expect(backgrounds.body.activate).toHaveBeenCalledWith(null, null);
            });

        });

        describe('when settings are defined', () => {

            it('should activate header with corresponding settings', () => {
                let backgrounds = new Backgrounds();
                spyOn(backgrounds.header, 'activate');
                spyOn(backgrounds.body, 'activate');
                let settings = {
                    header: {}
                };

                backgrounds.activate(settings);

                expect(backgrounds.header.activate).toHaveBeenCalledWith(settings.header, null);
            });

            it('should activate body with corresponding settings', () => {
                let backgrounds = new Backgrounds();
                spyOn(backgrounds.header, 'activate');
                spyOn(backgrounds.body, 'activate');
                let settings = {
                    body: {}
                };

                backgrounds.activate(settings);

                expect(backgrounds.body.activate).toHaveBeenCalledWith(settings.body, null);
            });

        });

        describe('when defaults are defined', () => {
            
            it('should activate header with corresponding defaults', () => {
                let backgrounds = new Backgrounds();
                spyOn(backgrounds.header, 'activate');
                spyOn(backgrounds.body, 'activate');
                
                let defaults = {
                    header:{}
                }

                backgrounds.activate(null, defaults);

                expect(backgrounds.header.activate).toHaveBeenCalledWith(null, defaults.header);
            });

            it('should activate body with corresponding defaults', () => {
                let backgrounds = new Backgrounds();
                spyOn(backgrounds.header, 'activate');
                spyOn(backgrounds.body, 'activate');
                
                let defaults = {
                    body:{}
                }

                backgrounds.activate(null, defaults);

                expect(backgrounds.body.activate).toHaveBeenCalledWith(null, defaults.body);
            });
        });

        describe('when user has Plus plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
            });

            it('should set available true', () =>{

                let backgrounds = new Backgrounds();
                backgrounds.activate();

                expect(backgrounds.available).toBeTruthy();
        
            })
        
        })

        describe('when user doesn`t have  Plus plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
            });

            it('should set available false', () =>{

                let backgrounds = new Backgrounds();
                backgrounds.activate();

                expect(backgrounds.available).toBeFalsy();
        
            });
        
        });

        describe('when edit is allowed', () => {
            it('should set allowEdit true', () => {
                let backgrounds = new Backgrounds();
                backgrounds.activate(null, null, true);

                expect(backgrounds.allowEdit).toBeTruthy();
            });
        });

        describe('when edit is not allowed', () => {
            it('should set allowEdit false', () => {
                let backgrounds = new Backgrounds();
                backgrounds.activate(null, null, false);

                expect(backgrounds.allowEdit).toBeFalsy();
            });
        });

    });

});