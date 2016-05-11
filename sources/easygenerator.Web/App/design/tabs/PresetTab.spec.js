import ko from 'knockout';
import app from 'durandal/app';

import PresetTab from './PresetTab.js';
import { Preset } from './PresetTab.js';

import templateRepository from 'repositories/templateRepository.js';

import { EVENT_PRESET_SELECTED } from './PresetTab.js';

describe('Preset tab', () => {

    describe('name:', () => {

        it('should be defined', () => {
            let tab = new PresetTab();
            expect(tab.name).toEqual('presets');
        });

    });

    describe('title:', () => {

        it('should be defined', () => {
            let tab = new PresetTab();
            expect(tab.name).toEqual('presets');
        });

    });

    describe('type:', () => {

        it('should be \'presets\'', () => {
            let tab = new PresetTab();
            expect(tab.type).toEqual('presets');
        });

    });

    describe('isSelected:', () => {

        it('should be observable', () => {
            let tab = new PresetTab();
            expect(tab.isSelected).toBeObservable();
        });

    });

    describe('collection:', () => {

        it('should be observable array', () => {
            let tab = new PresetTab();
            expect(tab.collection).toBeObservableArray();
        });

    });

    describe('select:', () => {

        describe('when preset is already selected', () => {

            it('should not trigger event ', () => {
                let preset = { settings: {}, isSelected: ko.observable(true) };
                let tab = new PresetTab();
                spyOn(app, 'trigger');
                tab.select(preset);
                expect(app.trigger).not.toHaveBeenCalledWith(EVENT_PRESET_SELECTED, preset.settings);
            });

        });

        it('should trigger event ', () => {
            let preset = { settings: {} };
            let tab = new PresetTab();
            spyOn(app, 'trigger');
            tab.select(preset);
            expect(app.trigger).toHaveBeenCalledWith(EVENT_PRESET_SELECTED, preset);
        });

        it('should mark preset as selected', () => {
            let preset = new Preset({});
            let tab = new PresetTab();

            tab.select(preset);

            expect(preset.isSelected()).toBeTruthy();
        });

        it('should mark other presets as not selected', () => {
            let preset1 = new Preset({});
            preset1.isSelected(true);
            let preset2 = new Preset({});
            preset2.isSelected(true);
            let tab = new PresetTab();
            tab.collection([preset1, preset2]);

            tab.select(new Preset({}));

            expect(preset1.isSelected()).toBeFalsy();
            expect(preset2.isSelected()).toBeFalsy();
        });

    });

    describe('activate:', () => {

        it('should get template from repository', () => {
            let tab = new PresetTab();
            spyOn(templateRepository, 'getById').and.returnValue(Promise.reject());;
            tab.activate('templateId').catch(() => {});
            expect(templateRepository.getById).toHaveBeenCalledWith('templateId');
        });

        
        describe('when template was not found', () => {

            beforeEach(() => {
                spyOn(templateRepository, 'getById').and.returnValue(Promise.reject('Template does not exist'));
            });

            it('should reject promise', done => {
                let tab = new PresetTab();
                
                tab.activate('templateId').catch(reason => {
                    expect(reason).toEqual('Template does not exist');
                    done();
                });
            });
            
        });

        describe('when template was found', () => {

            describe('and presets is not an array', () => {

                beforeEach(() => {
                    spyOn(templateRepository, 'getById').and.returnValue(Promise.resolve({
                        presets: null
                    }));
                });

                it('should set empty preset collection', done => {
                    let tab = new PresetTab();
                    tab.activate().then(() => {
                        expect(tab.collection().length).toEqual(0);
                        done();
                    });
                });

            });

            describe('and presets is an array', () => {
                
                beforeEach(() => {
                    spyOn(templateRepository, 'getById').and.returnValue(Promise.resolve({
                        presets: [{  settings: { xApi: {}}}, { settings: { branding: {} } }]
                    }));
                });

                it('should set corresponding preset collection', done => {
                    let tab = new PresetTab();
                    tab.activate().then(() => {
                        expect(tab.collection().length).toEqual(2);
                        done();
                    });
                });

                describe('and preset matches current settings', () => {
                    
                    it('should mark it as selected', done => {
                        let tab = new PresetTab();
                        tab.activate('', { branding: {}}).then(() => {
                            expect(tab.collection()[1].isSelected()).toBeTruthy();
                            done();
                        });
                    });

                });

                describe('and preset does not match current settings', () => {
                    
                    it('should not mark it as selected', done => {
                        let tab = new PresetTab();
                        tab.activate('', { branding: {}}).then(() => {
                            expect(tab.collection()[0].isSelected()).toBeFalsy();
                            done();
                        });
                    });

                });

            });

        });

    });

});

describe('Preset', () => {

    describe('title:', () => {
        
        it('should be defined', () => {
            let preset = new Preset({
                title: 'default'
            });
            expect(preset.title).toEqual('default');
        });

    });

    describe('settings:', () => {
        
        it('should be defined', () => {
            let settings = { }
            let preset = new Preset({ settings: settings });
            expect(preset.settings).toEqual(settings);
        });

    });

    describe('isSelected:', () => {
        
        it('should be observable', () => {
            let preset = new Preset({ });
            expect(preset.isSelected).toBeObservable();
        });

    });

    describe('textColor:', () => {

        describe('when corresponding settings section exist', () => {
           
            it('should use color from this section', () => {
                let preset = new Preset({
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
                expect(preset.textColor).toEqual('#aabbcc');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default textColor', () => {
                let preset = new Preset({});
                expect(preset.textColor).toEqual('#000');
            });

        });

    });

    describe('mainColor:', () => {

        describe('when corresponding settings section exist', () => {
           
            it('should use color from this section', () => {
                let preset = new Preset({
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
                expect(preset.mainColor).toEqual('#43aaa3');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default mainColor', () => {
                let preset = new Preset({});
                expect(preset.mainColor).toEqual('#000');
            });

        });

    });

    describe('secondaryColor:', () => {

        describe('when corresponding settings section exist', () => {
           
            it('should use color from this section', () => {
                let preset = new Preset({
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
                expect(preset.secondaryColor).toEqual('#43aaa3');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default mainColor', () => {
                let preset = new Preset({});
                expect(preset.secondaryColor).toEqual('#000');
            });

        });

    });

    describe('backgroundColor', () => {
       
        describe('when corresponding settings section exist', () => {
           
            it('should use color', () => {
                let preset = new Preset({
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
                expect(preset.backgroundColor).toEqual('#aabbcc');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default mainColor', () => {
                let preset = new Preset({});
                expect(preset.backgroundColor).toEqual('#fff');
            });

        });

    });

    describe('backgroundTexture:', () => {
        
        describe('when corresponding settings section exist', () => {
           
            it('should use texture', () => {
                let preset = new Preset({
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
                expect(preset.backgroundTexture).toEqual('url');
            });

        });

        describe('when corresponsing settings section does not exist', () => {
           
            it('should use default mainColor', () => {
                let preset = new Preset({});
                expect(preset.backgroundTexture).toEqual(null);
            });

        });
    });

});