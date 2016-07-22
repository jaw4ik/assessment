import ko from 'knockout';
import app from 'durandal/app';

import ThemesTab from './ThemesTab.js';
import { Theme } from './ThemesTab.js';

import templateRepository from 'repositories/templateRepository.js';
import localizationManager from 'localization/localizationManager.js';
import themeRepository from 'repositories/themeRepository.js';
import themesEvents from './themes/events.js';

describe('[Themes tab]', () => {

    beforeEach(() => {
        spyOn(localizationManager, 'localize').and.callFake(key => key);
    });

    describe('name:', () => {

        it('should be \'themes\'', () => {
            let tab = new ThemesTab();
            expect(tab.name).toEqual('themes');
        });

    });

    describe('title:', () => {

        it('should be defined', () => {
            let tab = new ThemesTab();
            expect(tab.title).toBeDefined();
        });

    });

    describe('type:', () => {

        it('should be \'themes\'', () => {
            let tab = new ThemesTab();
            expect(tab.type).toEqual('themes');
        });

    });

    describe('isSelected:', () => {

        it('should be observable', () => {
            let tab = new ThemesTab();
            expect(tab.isSelected).toBeObservable();
        });

    });

    describe('viewUrl:', () => {
        it('should be \'design/tabs/ThemesTab.html\'', () => {
            let tab = new ThemesTab();
            expect(tab.viewUrl).toBe('design/tabs/ThemesTab.html');
        });
    });

    describe('defaultThemes:', () => {

        it('should be observable array', () => {
            let tab = new ThemesTab();
            expect(tab.defaultThemes).toBeObservableArray();
        });

    });

    describe('userThemes:', () => {
        it('should be observable array', () => {
            let tab = new ThemesTab();
            expect(tab.userThemes).toBeObservableArray();
        });
    });

    describe('selectedTheme:', () => {
        it('should be observable', () => {
            let tab = new ThemesTab();
            expect(tab.selectedTheme).toBeObservable();
        });
    });

    describe('selectTheme:', () => {

        beforeEach(() => {
            spyOn(app, 'trigger');
        });

        describe('when theme is already selected', () => {

            it('should not trigger event ', () => {
                let theme = { settings: {} };
                let tab = new ThemesTab();
                tab.selectedTheme(theme);
                
                tab.selectTheme(theme);
                expect(app.trigger).not.toHaveBeenCalled();
            });

        });

        describe('when theme has changes', () => {
            
        });

        it('should trigger event ', () => {
            let theme = { settings: {} };
            let tab = new ThemesTab();
            tab.selectTheme(theme);
            expect(app.trigger).toHaveBeenCalledWith(themesEvents.selected, { id: theme.id, title: theme.title, settings: theme.settings });
        });

        it('should select theme', () => {
            let theme = new Theme({});
            let tab = new ThemesTab();

            tab.selectTheme(theme);

            expect(tab.selectedTheme()).toBe(theme);
        });

    });

    describe('activate:', () => {

        it('should be function', () => {
            let tab = new ThemesTab();
            expect(tab.activate).toBeFunction();
        });

    });

});

describe('Theme', () => {

    describe('title:', () => {
        
        it('should be defined', () => {
            let theme = new Theme({
                title: 'default'
            });
            expect(theme.title).toEqual('default');
        });

    });

    describe('settings:', () => {
        
        it('should be defined', () => {
            let settings = { }
            let theme = new Theme({ settings: settings });
            expect(theme.settings).toEqual(settings);
        });

    });

    describe('textColor:', () => {

        describe('when corresponding settings section exist', () => {
           
            it('should use color from this section', () => {
                let theme = new Theme({
                    settings: {
                        branding: {
                            colors: [
                                {
                                    key: '@text-color',
                                    value: '#aabbcc'
                                }
                            ]
                        }
                    }
                });
                expect(theme.textColor()).toEqual('#aabbcc');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default textColor', () => {
                let theme = new Theme({});
                expect(theme.textColor()).toEqual('#000');
            });

        });

    });

    describe('mainColor:', () => {

        describe('when corresponding settings section exist', () => {
           
            it('should use color from this section', () => {
                let theme = new Theme({
                    settings: {
                        branding: {
                            colors: [
                                {
                                    key: '@main-color',
                                    value: '#43aaa3'
                                }
                            ]
                        }
                    }
                });
                expect(theme.mainColor()).toEqual('#43aaa3');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default mainColor', () => {
                let theme = new Theme({});
                expect(theme.mainColor()).toEqual('#000');
            });

        });

    });

    describe('secondaryColor:', () => {

        describe('when corresponding settings section exist', () => {
           
            it('should use color from this section', () => {
                let theme = new Theme({
                    settings: {
                        branding: {
                            colors: [
                                {
                                    key: '@secondary-color',
                                    value: '#43aaa3'
                                }
                            ]
                        }
                    }
                });
                expect(theme.secondaryColor()).toEqual('#43aaa3');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default mainColor', () => {
                let theme = new Theme({});
                expect(theme.secondaryColor()).toEqual('#000');
            });

        });

    });

    describe('backgroundColor', () => {
       
        describe('when corresponding settings section exist', () => {
           
            it('should use color', () => {
                let theme = new Theme({
                    settings: {
                        branding: {
                            background: {
                                body: {
                                    color: '#aabbcc'
                                }
                            }
                        }
                    }
                });
                expect(theme.backgroundColor()).toEqual('#aabbcc');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default mainColor', () => {
                let theme = new Theme({});
                expect(theme.backgroundColor()).toEqual('#fff');
            });

        });

    });

    describe('backgroundTexture:', () => {
        
        describe('when corresponding settings section exist', () => {
           
            it('should use texture', () => {
                let theme = new Theme({
                    settings: {
                        branding: {
                            background: {
                                body: {
                                    texture: 'url'
                                }
                            }
                        }
                    }
                });
                expect(theme.backgroundTexture()).toEqual('url');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default mainColor', () => {
                let theme = new Theme({});
                expect(theme.backgroundTexture()).toBeUndefined();
            });

        });
    });

});