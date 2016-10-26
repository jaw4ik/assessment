import ko from 'knockout';

import viewModel from './design.js';
import router from 'routing/router';
import notify from 'notify';
import courseRepository from 'repositories/courseRepository';
import waiter from 'utils/waiter';
import constants from 'constants';
import app from 'durandal/app';

import BrandingTab from './tabs/BrandingTab.js';
import ThemesTab from './tabs/ThemesTab.js';

import * as saveCommand from './commands/saveCourseTemplateSettings.js';
import * as getCommand from './commands/getCourseTemplateSettings.js';
import themesEvents from './tabs/themes/events.js';
import userContext from 'userContext';


describe('viewModel [design]', () => {

    beforeEach(() => {
        spyOn(notify, 'saved');
        spyOn(notify, 'error');
        spyOn(notify, 'success');
        spyOn(app, 'on').and.callFake(events => {
            return {
                then() {
                    return this;
                },
                off() {
                    
                },
                events
            };
        });
        spyOn(app, 'off');
    });

    describe('settingsLoadingTimeoutId:', () => {

        it('should be defined', () => {
            expect(viewModel.settingsLoadingTimeoutId).toBeDefined();
        });

    });

    describe('settingsVisibilitySubscription:', () => {

        it('should be defined', () => {
            expect(viewModel.settingsVisibilitySubscription).toBeDefined();
        });

    });

    describe('canDeactivate:', () => {

        it('should wait for save template settings', () => {
            spyOn(waiter, 'waitFor').and.returnValue(Promise.reject());
            viewModel.canDeactivate();
            expect(waiter.waitFor).toHaveBeenCalled();
        });

        it('should hide template settings', () => {
            viewModel.settingsVisibility(null);
            viewModel.canDeactivate();
            expect(viewModel.settingsVisibility()).toBeFalsy();
        });

        describe('when settings are saved', () => {

            beforeEach(() => {
                spyOn(waiter, 'waitFor').and.returnValue(Promise.resolve());
            });

            it('should resolve promise', done => {
                viewModel.canDeactivate().then(result => {
                    expect(result).toEqual(true);
                    done();
                });
            });

            it('should show template settings', done => {
                viewModel.settingsVisibility(false);
                viewModel.canDeactivate().then(() => {
                    expect(viewModel.settingsVisibility()).toBeTruthy();
                    done();
                });
            });

        });

        describe('when settings are not saved', () => {

            beforeEach(() => {
                spyOn(waiter, 'waitFor').and.returnValue(Promise.reject());
            });

            it('should send notification error', done => {
                viewModel.canDeactivate().then(() => {
                    expect(notify.error).toHaveBeenCalled();
                    done();
                });
            });

            it('should resolve promise', done => {
                viewModel.canDeactivate().then(result => {
                    expect(result).toEqual(true);
                    done();
                });
            });

            it('should show template settings', done => {
                viewModel.settingsVisibility(false);
                viewModel.canDeactivate().then(() => {
                    expect(viewModel.settingsVisibility()).toBeTruthy();
                    done();
                });
            });

        });

    });

    describe('subscriptions:', () => {
        
        it('should be array', () => {
            expect(viewModel.subscriptions).toBeArray();
        });

    });

    describe('activate:', () => {

        let resolve, reject;
        let getCourseTemplateSettings = {};

        beforeEach(() => {
            spyOn(courseRepository, 'getById').and.returnValue(new Promise((_resolve, _reject) => {
                resolve = _resolve;
                reject = _reject;
            }));
            spyOn(getCommand, 'getCourseTemplateSettings').and.returnValue(new Promise((resolve, reject) => {
                getCourseTemplateSettings.resolve = resolve;
                getCourseTemplateSettings.reject = reject;
            }));
            spyOn(viewModel, 'loadSettings').and.returnValue(Promise.resolve());

            userContext.identity = { email: 'user@easygenerator.com' };
            spyOn(userContext, 'hasAcademyAccess').and.returnValue(true);
        });

        it('should set settingsVisibility to false', () => {
            viewModel.settingsVisibility(true);
            viewModel.activate();
            expect(viewModel.settingsVisibility()).toBeFalsy();
        });

        it('should subscribe to settingsVisibility', () => {
            viewModel.settingsVisibilitySubscription = null;
            viewModel.activate();
            expect(viewModel.settingsVisibilitySubscription).not.toBeNull();
        });

        describe('and after subscribe', () => {

            it('should clear timeout when settingsVisibility changed', () => {
                viewModel.settingsVisibility(false);
                viewModel.settingsLoadingTimeoutId = 'some_id';

                viewModel.activate();
                viewModel.settingsVisibility(true);

                expect(viewModel.settingsLoadingTimeoutId).toBeNull();
            });

        });

        it('should get course from repository', () => {
            var courseId = 'courseId';
            viewModel.activate(courseId);
            expect(courseRepository.getById).toHaveBeenCalledWith(courseId);
        });

        describe('when course was not found', () => {

            beforeEach(() => {
                reject('reason');
            });

            it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', done => {
                router.activeItem.settings.lifecycleData = null;

                viewModel.activate('courseId').catch(() => {
                    expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                    done();
                });
            });

            it('should reject promise', done => {
                viewModel.activate('courseId').catch(reason => {
                    expect(reason).toEqual('reason');
                    done();
                });
            });

        });

        describe('when course exists', () => {

            let
                templates = [
                    { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], description: "Default template", previewDemoUrl: 'preview_url_default', settingsUrls: { design: null, configure: null }, isLoading: ko.observable(false), fonts: [{fontFamily: 'customFont', url: 'someurl', isLocal: false}] },
                    { id: "1", name: "Quiz", thumbnail: "path/to/image2.png", previewImages: ["path/to/previewImg.png"], description: "Quiz template", previewDemoUrl: 'preview_url_quiz', settingsUrls: { design: null, configure: null }, isLoading: ko.observable(false) },
                    { id: "2", name: "Simple", thumbnail: "path/to/image2.png", supports: ['branding'], presets: [{ title: 'default', settings: { branding: {} } }], settingsUrls: { design: null, configure: null } }
                ],
                template = templates[0],
                course = { id: 'courseId', template: template, createdBy: 'user@easygenerator.com' };

            
            it('should set courseId', done => {
                resolve(course);
                getCourseTemplateSettings.resolve();

                viewModel.courseId = null;
                viewModel.activate(course.id).then(() => {
                    
                    expect(viewModel.courseId).toBe(course.id);
                    done();
                });
            });

            it('should set previewUrl', done => {
                resolve(course);
                getCourseTemplateSettings.resolve();

                viewModel.activate(course.id).then(() => {
                    expect(viewModel.previewUrl()).toBe('/preview/' + course.id);
                    done();
                });
            });

            it('should set template', done => {
                resolve(course);
                getCourseTemplateSettings.resolve();

                viewModel.template(null);
                viewModel.activate(course.id).then(() => {
                    expect(viewModel.template()).toBeDefined();
                    done();
                });
            });

            it('should subscribe to templateUpdated event and save subscription', done => {
                viewModel.subscriptions = [];
                resolve(course);
                getCourseTemplateSettings.resolve();

                viewModel.activate(course.id).then(() => {
                    expect(viewModel.subscriptions[0].events).toEqual(constants.messages.course.templateUpdated + course.id);
                    done();
                });
            });

            it('should subscribe to templateUpdatedByCollaborator event and save subscription', done => {
                viewModel.subscriptions = [];
                resolve(course);
                getCourseTemplateSettings.resolve();

                viewModel.activate(course.id).then(() => {
                    expect(viewModel.subscriptions[1].events).toEqual(constants.messages.course.templateUpdatedByCollaborator);
                    done();
                });
            });

            it(`should subscribe to theme selected event and save subscription`, done => {
                viewModel.subscriptions = [];
                resolve(course);
                getCourseTemplateSettings.resolve();

                viewModel.activate(course.id).then(() => {
                    expect(viewModel.subscriptions[2].events).toEqual(themesEvents.selected);
                    done();
                });
            });

            it(`should subscribe to all bus event and save subscription`, done => {
                viewModel.subscriptions = [];
                resolve(course);
                getCourseTemplateSettings.resolve();

                viewModel.activate(course.id).then(() => {
                    expect(viewModel.subscriptions[3].events).toEqual('all');
                    done();
                });
            });

            it('should subscribe to font events', done => {
                viewModel.subscriptions = [];
                resolve(course);
                getCourseTemplateSettings.resolve();

                viewModel.activate(course.id).then(() => {
                    expect(viewModel.subscriptions[4].events).toEqual('font:settings-changed');
                    done();
                });
            
            });

            it('should subscribe to text color change event', done => {
                viewModel.subscriptions = [];
                resolve(course);
                getCourseTemplateSettings.resolve();

                viewModel.activate(course.id).then(() => {
                    expect(viewModel.subscriptions[5].events).toEqual('text-color:changed');
                    done();
                });
            
            });

            describe('when template supports default branding', () => {

                beforeEach(() => {
                    resolve({
                        id: 'courseId',
                        template: { id: "0", name: "Simple", supports: ['branding'], themes: [], settingsUrls: { design: null, configure: null } }
                    });
                    getCourseTemplateSettings.resolve();
                });

                it('should show branding tab', done => {
                    viewModel.template(null);
                    viewModel.activate(course.id).then(() => {
                        expect(viewModel.settingsTabs()[0]).toBeInstanceOf(BrandingTab),
                        done();
                    }); 
                });

                it('should select branding tab by default', done => {
                    viewModel.tab(null);
                    viewModel.activate(course.id).then(() => {
                        expect(viewModel.tab()).toBeInstanceOf(BrandingTab),
                        done();
                    }); 
                });

            });

            describe('when template has themes', () => {
                
                beforeEach(() => {
                    resolve({
                        id: 'courseId',
                        template: { id: "0", name: "Simple", supports: ['branding'], presets: [{ title: 'default', settings: { branding: {} } }], settingsUrls: { design: null, configure: null } }
                    });
                    getCourseTemplateSettings.resolve();
                });

                it('should show themes tab', done => {
                    viewModel.template(null);
                    viewModel.activate(course.id).then(() => {
                        expect(viewModel.settingsTabs()[0]).toBeInstanceOf(ThemesTab),
                        done();
                    }); 
                });

                it('should select themes tab by default', done => {
                    viewModel.tab(null);
                    viewModel.activate(course.id).then(() => {
                        expect(viewModel.tab()).toBeInstanceOf(ThemesTab),
                        done();
                    }); 
                });

            });

            it('should set first tab as selected', done => {
                resolve({ id: 'courseId', template: { id: "0", name: "Simple", supports: [], settingsUrls: { design: [{ name: 'branding', url: 'branding.html' }], configure: null } } });
                getCourseTemplateSettings.resolve();
                viewModel.activate(course.id).then(() => {
                    expect(viewModel.settingsTabs()[0].isSelected()).toBeTruthy();
                    done();
                }); 
            });

            it('should set other tabs as not selected', done => {
                viewModel.brandingTab.isSelected(true);
                viewModel.themesTab.isSelected(true);
                resolve({ id: 'courseId', template: { id: "0", name: "Simple", supports: ['branding'], presets: [{ title: 'default', settings: { branding: {} } }], settingsUrls: { design: [{ name: 'branding', url: 'branding.html' }], configure: null } } });
                getCourseTemplateSettings.resolve();
                viewModel.activate(course.id).then(() => {
                    expect(viewModel.settingsTabs()[1].isSelected()).toBeFalsy();
                    expect(viewModel.settingsTabs()[2].isSelected()).toBeFalsy();
                    done();
                }); 
            });

            it('should load settings', done => {
                resolve(course);
                getCourseTemplateSettings.resolve();
                viewModel.activate(course.id).then(() => {
                    expect(viewModel.loadSettings).toHaveBeenCalledWith();
                    done();
                }); 
            });

            describe('after load settings', () => {
                it('should add custom fonts into fonts tab', done => {
                    resolve(course);

                    getCourseTemplateSettings.resolve();
                    viewModel.activate(course.id).then(() => {
                        expect(viewModel.loadSettings).toHaveBeenCalledWith();
                        console.log(viewModel.template());
                        expect(viewModel.fontsTab.customFonts[0].name).toBe('customFont');
                        done();
                    }); 
                });
            });

        });

    });

    describe('deactivate:', () => {

        it('should be function', () => {
            expect(viewModel.deactivate).toBeFunction();
        });

        describe('when settingsVisibilitySubscription is not null', () => {

            beforeEach(() => {
                viewModel.settingsVisibilitySubscription = {
                    dispose: jasmine.createSpy()
                };
            });

            it('should dispose subscription', () => {
                viewModel.deactivate();
                expect(viewModel.settingsVisibilitySubscription.dispose).toHaveBeenCalled();
            });

        });

        it('should unsubscribe all subscriptions', () => {
            let s1 = { off: () => {} };
            let s2 = { off: () => {} };
            viewModel.subscriptions = [s1, s2];
            
            spyOn(s1, 'off');
            spyOn(s2, 'off');
            
            viewModel.deactivate();

            expect(s1.off).toHaveBeenCalled();
            expect(s2.off).toHaveBeenCalled();
        });

    });

    describe('templateUpdated:', () => {

        var template;

        beforeEach(() => {
            template = {
                id: "0",
                name: "Default",
                thumbnail: "path/to/image1.png",
                previewImages: ["path/to/previewImg.png"],
                description: "Default template",
                previewDemoUrl: 'preview_url_default',
                settingsUrls: { design: null, configure: null },
                order: 1,
                isNew: false,
                isCustom: false,
                isLoading: ko.observable(false)
            };

            spyOn(viewModel, 'loadSettings').and.returnValue(Promise.resolve());
        });

        describe('when template is current template', () => {
            
            beforeEach(() => {
                viewModel.template(template);
                spyOn(waiter, 'waitFor').and.returnValue(Promise.resolve());
            });

            it('should not wait for load template settings', () => {
                viewModel.templateUpdated(template);
                expect(waiter.waitFor).not.toHaveBeenCalled();
            });

        });

        describe('when template is not current template', () => {
            var currentTemplate = { id: 'someId', isLoading: ko.observable() };
        
            beforeEach(() => {
                viewModel.template(currentTemplate);
            });

            it('should mark template as loading', () => {
                spyOn(waiter, 'waitFor').and.returnValue(Promise.resolve());

                currentTemplate.isLoading(false);
                viewModel.templateUpdated(template);

                expect(currentTemplate.isLoading()).toBeTruthy();
            });

            it('should mark as loading template', () => {
                spyOn(waiter, 'waitFor').and.returnValue(Promise.resolve());

                viewModel.loadingTemplate(false);
                viewModel.templateUpdated(template);

                expect(viewModel.loadingTemplate()).toBeTruthy();
            });

            it('should wait for save template settings', () => {
                spyOn(waiter, 'waitFor').and.returnValue(Promise.resolve());

                viewModel.templateUpdated(template);

                expect(waiter.waitFor).toHaveBeenCalled();
            });

            describe('when waiter successed', () => {
                
                beforeEach(() => {
                    spyOn(waiter, 'waitFor').and.returnValue(Promise.resolve());
                });

                it('should hide template settings', done => {
                    viewModel.settingsVisibility(true);

                    viewModel.templateUpdated(template).then(() => {
                        expect(viewModel.settingsVisibility()).toBeFalsy();
                        done();
                    });
                });

                it('should set loadingTemplate to false', done => {
                    viewModel.loadingTemplate(true);

                    viewModel.templateUpdated(template).then(() => {
                        expect(viewModel.loadingTemplate()).toBeFalsy();
                        done();
                    });
                });

                it('should update template', done => {
                    viewModel.template(currentTemplate);

                    viewModel.templateUpdated(template).then(() => {
                        expect(viewModel.template().id).toBe(template.id);
                        done();
                    });
                });

                it('should load course template settings', done => {
                    viewModel.templateUpdated(template).then(() => {
                        expect(viewModel.loadSettings).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when waiter failed', () => {
                
                beforeEach(() => {
                    spyOn(waiter, 'waitFor').and.returnValue(Promise.reject());
                });

                it('should send notification error', done => {
                    viewModel.templateUpdated(template).then(() => {
                        expect(notify.error).toHaveBeenCalled();
                        done();
                    });
                });

                it('should hide template settings', done => {
                    viewModel.settingsVisibility(true);

                    viewModel.templateUpdated(template).then(() => {
                        expect(viewModel.settingsVisibility()).toBeFalsy();
                        done();
                    });
                });

                it('should set loadingTemplate to false', done => {
                    viewModel.loadingTemplate(true);

                    viewModel.templateUpdated(template).then(() => {
                        expect(viewModel.loadingTemplate()).toBeFalsy();
                        done();
                    });
                });

                it('should update template', done => {
                    viewModel.template(currentTemplate);

                    viewModel.templateUpdated(template).then(() => {
                        expect(viewModel.template().id).toBe(template.id);
                        done();
                    });
                });

            });
        });
    });


    describe('courseId:', () => {
    
        it('should be defined', () => {
            expect(viewModel.courseId).toBeDefined();
        });
    
    });

    describe('previewUrl:', () => {
    
        it('should be observable', () => {
            expect(viewModel.previewUrl).toBeObservable();
        });

    });

    describe('settingsTabs:', () => {

        it('should be observable array', () => {
            expect(viewModel.settingsTabs).toBeObservableArray();
        });

    });

    describe('changeTab:', () => {

        describe('when tab has incorrect format', () => {
            
            let tab;
        
            beforeEach(() => {
                viewModel.settingsVisibility(true);
            });

            it('should not change settingsVisibility property', () => {
                tab = null;
                viewModel.changeTab(tab);
                expect(viewModel.settingsVisibility()).toBeTruthy();

                tab = undefined;
                viewModel.changeTab(tab);
                expect(viewModel.settingsVisibility()).toBeTruthy();
            });

        });

        describe('when tab has correct format', () => {
            
            let tab1,tab2;

            beforeEach(() => {
                tab1 = { name: 'name', isSelected: ko.observable(true), title: 'title', url: 'url' }
                tab2 = { name: 'name2', isSelected: ko.observable(false), title: 'titl2', url: 'url2' };

                viewModel.settingsVisibility(true);
                viewModel.settingsTabs([tab1, tab2]);
            });

            describe('and tab is already selected', () => {
            
                beforeEach(() => {
                    viewModel.settingsVisibility(true);
                    tab1.isSelected(true);
                });

                it('should not change settings visibility', () => {
                    viewModel.changeTab(tab1);
                    expect(viewModel.settingsVisibility()).toBeTruthy();
                });

            });

            describe('and tab was not selected', () => {

                beforeEach(() => {
                    viewModel.tab(tab1);
                });

                it('should set settingsVisibility property to false', () => {
                    viewModel.settingsVisibility(true);

                    viewModel.changeTab(tab2);

                    expect(viewModel.settingsVisibility()).toBeFalsy();
                });

                it('should unselect previous selected tab', () => {
                    viewModel.settingsTabs()[0].isSelected(true);
                    viewModel.changeTab(tab2);
                    expect(viewModel.settingsTabs()[0].isSelected()).toBeFalsy();
                });

                it('should select current tab', () => {
                    viewModel.settingsTabs()[1].isSelected(false);

                    viewModel.changeTab(tab2);

                    expect(viewModel.settingsTabs()[1].isSelected()).toBeTruthy();
                });

            });

        });

    });

    describe('loadingTemplate:', () => {

        it('should be observable', () => {
            expect(viewModel.loadingTemplate).toBeObservable();
        });

    });

    describe('template:', () => {

        it('should be observable', () => {
            expect(viewModel.template).toBeObservable();
        });

    });

    describe('canUnloadSettings:', () => {
    
        it('should be observable', () => {
            expect(viewModel.canUnloadSettings).toBeObservable();
        });

    });

    describe('reloadPreview:', () => {
        
        beforeEach(() => {
            spyOn(viewModel.previewUrl, 'valueHasMutated');
        });

        it('should be function', () => {
            expect(viewModel.reloadPreview).toBeFunction();
        });

        it('should reset previewUrl', () => {
            viewModel.reloadPreview();
            expect(viewModel.previewUrl.valueHasMutated).toHaveBeenCalled();
        });

    });

    describe('settingsFrameLoaded:', () => {

        it('should be function', () => {
            expect(viewModel.settingsFrameLoaded).toBeFunction();
        });

        it('shoul set save state for template settings', () => {
            viewModel.canUnloadSettings(false);
            viewModel.settingsFrameLoaded();
            expect(viewModel.canUnloadSettings()).toBeTruthy();
        });

        it('should set settingsLoadingTimeoutId', () => {
            viewModel.settingsLoadingTimeoutId = null;
            viewModel.settingsFrameLoaded();
            expect(viewModel.settingsLoadingTimeoutId).not.toBeNull();
        });

        it('should show settings after timeout', () => {
            jasmine.clock().install();
            viewModel.settingsVisibility(false);

            viewModel.settingsFrameLoaded();
            jasmine.clock().tick(2100);

            expect(viewModel.settingsVisibility()).toBeTruthy();
            jasmine.clock().uninstall();
        });
    });

    describe('onGetTemplateMessage', () => {

        it('should be function', () => {
            expect(viewModel.onGetTemplateMessage).toBeFunction();
        });

        let message;

        describe('when message object is empty', () => {

            beforeEach(() => {
                message = null;
            });

            it('should not send error notification', () => {
                viewModel.onGetTemplateMessage(message);
                expect(notify.error).not.toHaveBeenCalled();
            });

            it('should not send success notification', () => {
                viewModel.onGetTemplateMessage(message);
                expect(notify.success).not.toHaveBeenCalled();
            });

        });

        describe('when message object have \'show-settings\' type', () => {

            beforeEach(() => {
                message = { type: 'show-settings' };
            });

            it('should set settingsVisibility to true', () => {
                viewModel.settingsVisibility(false);
                viewModel.onGetTemplateMessage(message);
                expect(viewModel.settingsVisibility()).toBeTruthy();
            });

        });

        describe('when message object have \'freeze-editor\' type', () => {

            beforeEach(() => {
                message = { type: 'freeze-editor' };
            });

            it('should set settings into not saved state', () => {
                viewModel.canUnloadSettings(true);
                viewModel.onGetTemplateMessage(message);
                expect(viewModel.canUnloadSettings()).toBeFalsy();
            });

        });

        describe('when message object have \'unfreeze-editor\' type', () => {

            beforeEach(() => {
                message = { type: 'unfreeze-editor' };
            });

            it('should set settings into saved state', () => {
                viewModel.canUnloadSettings(false);
                viewModel.onGetTemplateMessage(message);
                expect(viewModel.canUnloadSettings()).toBeTruthy();
            });

        });

        describe('when message object have \'notification\' type', () => {

            beforeEach(() => {
                message = { type: 'notification' };
            });

            describe('when data.success is true', () => {

                beforeEach(() => {
                    message.data = {
                        success: true
                    };

                    spyOn(viewModel, 'reloadPreview');
                });

                it('should reload preview', () => {
                    viewModel.onGetTemplateMessage(message);
                    expect(viewModel.reloadPreview).toHaveBeenCalled();
                });

                describe('and when message exists', () => {

                    beforeEach(() => {
                        message.data.message = "Message text";
                    });

                    it('should show success notification', () => {
                        viewModel.onGetTemplateMessage(message);
                        expect(notify.success).toHaveBeenCalledWith(message.data.message);
                    });

                });

                describe('and when message does not exist', () => {

                    beforeEach(() => {
                        message.data.message = null;
                    });

                    it('should show saved notification', () => {
                        viewModel.onGetTemplateMessage(message);
                        expect(notify.saved).toHaveBeenCalled();
                    });

                });

            });

            describe('when data.success is false', () => {

                beforeEach(() => {
                    message.data = {
                        success: false
                    };
                });

                describe('and when message exists', () => {

                    beforeEach(() => {
                        message.data.message = "Message text";
                    });

                    it('should show error notification', () => {
                        viewModel.onGetTemplateMessage(message);
                        expect(notify.error).toHaveBeenCalledWith(message.data.message);
                    });

                });

                describe('and when message does not exist', () => {

                    beforeEach(() => {
                        message.data.message = null;
                    });

                    it('should show error notification with default text', () => {
                        viewModel.onGetTemplateMessage(message);
                        expect(notify.error).toHaveBeenCalled();
                    });

                });

            });

        });

    });

    describe('themeSelected:', () => {

        beforeEach(() => {
            spyOn(viewModel, 'saveSettings').and.returnValue(Promise.resolve());
        });

        it('should update current theme', () => {
            let theme = { title: 'default', settings: { branding: { logo: { url: 'url' } } } };
            viewModel.selectedTheme = null;

            viewModel.themeSelected(theme);

            expect(viewModel.selectedTheme.title).toEqual(theme.title);
            expect(viewModel.selectedTheme.settings).toEqual(theme.settings);
        });


        it('should extend current settings', () => {
            viewModel.settings = { xApi: {}};

            viewModel.themeSelected({ settings: { branding: { logo: { url: 'url' } } } });

            expect(viewModel.settings).toEqual({ xApi: {}, branding: { logo: { url: 'url' } } });
        });

        describe('when theme does not have settings', () => {

            it('should set an empty object to current settings', () => {
                viewModel.settings = null;

                viewModel.themeSelected({});

                expect(viewModel.settings).toEqual({});
            });

        });

        it('should save settings', () => {
            viewModel.themeSelected({});

            expect(viewModel.saveSettings).toHaveBeenCalled();
        });

    });

    describe('loadSettings:', () => {

        it('should get current course template settings',done => {
            viewModel.courseId = 'courseId';
            viewModel.template({ id: 'templateId' });
            spyOn(getCommand, 'getCourseTemplateSettings').and.returnValue(Promise.resolve({}));

            viewModel.loadSettings().then(() => {
                expect(getCommand.getCourseTemplateSettings).toHaveBeenCalledWith('courseId', 'templateId');
                done();
            });
        });

        describe('and could not get course template settings', () => {
                
            beforeEach(() => {
                spyOn(getCommand, 'getCourseTemplateSettings').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => {
                viewModel.loadSettings().catch(reason => {
                    expect(reason).toEqual('reason');
                    done();
                });
            });
        });

        describe('when got course template settings successfully', () => {

            describe('and settings are not an object', () => {

                beforeEach(() => {
                    spyOn(getCommand, 'getCourseTemplateSettings').and.returnValue(Promise.resolve({
                        settings: null
                    }));
                });

                describe('and current course template has preset', () => {

                    it('should set selectedTheme', done => {
                        let theme = { title: 'default', settings: { branding: {}, xApi: {} } };
                        viewModel.selectedTheme = null;
                        viewModel.template({ id: 'templateId', presets: [theme] });

                        viewModel.loadSettings().then(() => {
                            expect(viewModel.selectedTheme.title).toEqual(theme.title);
                            done();
                        });
                    });

                    it('should set current theme copy to settings', done => {
                        let settings = { branding: {}, xApi: {} };
                        viewModel.settings = null;
                        viewModel.template({ id: 'templateId', presets: [{ title: 'default', settings }] });

                        viewModel.loadSettings()
                            .then(() => expect(viewModel.settings).toEqual(settings))
                            .then(() => viewModel.settings.property = '')
                            .then(() => expect(viewModel.settings).not.toEqual(settings))
                            .then(() => done());
                    });

                });

                describe('and current course template does not have themes', () => {

                    it('should set selectedTheme to null', done => {
                        viewModel.selectedTheme = {};
                        viewModel.template({ id: 'templateId' });

                        viewModel.loadSettings().then(() => {
                            expect(viewModel.selectedTheme).toEqual(null);
                            done();
                        });
                    });

                    it('should set an empty object to settings', done => {
                        viewModel.settings = null;
                        viewModel.template({ id: 'templateId' });

                        viewModel.loadSettings().then(() => {
                            expect(viewModel.settings).toEqual({});
                            done();
                        });
                    });

                });

            });

            describe('and settings are an object', () => {

                it('should set current course template settings', done => {
                    let settings = {};
                    viewModel.settings = null;
                    viewModel.template({ id: 'templateId' });

                    spyOn(getCommand, 'getCourseTemplateSettings').and.returnValue(Promise.resolve({ settings }));
                    
                    viewModel.loadSettings().then(() => {
                        expect(viewModel.settings).toEqual(settings);
                        done();
                    });
                });

                describe('and theme is specified', () => {

                    let extraData = { theme: 'default' };

                    beforeEach(() => {
                        spyOn(getCommand, 'getCourseTemplateSettings').and.returnValue(Promise.resolve({ settings: {}, extraData }));
                    });

                    describe('and template has this theme', () => {

                        it('should set current theme', done => {
                            let theme = { title: 'default', settings: { branding: {}, xApi: {} } };
                            viewModel.selectedTheme = null;
                            viewModel.template({ id: 'templateId', presets: [theme] });

                            viewModel.loadSettings().then(() => {
                                expect(viewModel.selectedTheme.title).toEqual(theme.title);
                                done();
                            });
                        });

                    });

                    describe('and template does not have this theme', () => {
                        
                        it('should set current theme to  null', done => {
                            viewModel.selectedTheme = null;
                            viewModel.template({ id: 'templateId', presets: [] });

                            viewModel.loadSettings().then(() => {
                                expect(viewModel.selectedTheme).toEqual(null);
                                done();
                            });
                        });

                    });

                });

                describe('and theme is not specified', () => {

                    let settings = {};

                    beforeEach(() => {
                        spyOn(getCommand, 'getCourseTemplateSettings').and.returnValue(Promise.resolve({ settings }));
                    });

                    describe('and current course template has themes', () => {

                        it('should set a default theme to current theme', done => {
                            let theme = { title: 'default', settings: { branding: {}, xApi: {} } };
                            viewModel.selectedTheme = {};
                            viewModel.template({ id: 'templateId', presets: [theme] });

                            viewModel.loadSettings().then(() => {
                                expect(viewModel.selectedTheme.title).toEqual(theme.title);
                                done();
                            });
                        });

                    });

                    describe('and current course template does not have themes', () => {

                        it('should set null to current theme', done => {
                            viewModel.selectedTheme = {};
                            viewModel.template({ id: 'templateId' });

                            viewModel.loadSettings().then(() => {
                                expect(viewModel.selectedTheme).toEqual(null);
                                done();
                            });
                        });

                    });

                });


            });

        });

    });

    describe('saveSettings:', () => {
       
        it('should save updated settings', () => {
            spyOn(saveCommand, 'saveCourseTemplateSettings').and.returnValue(Promise.resolve());
            viewModel.courseId = 'courseId';
            viewModel.template({ id: 'templateId' });
            viewModel.settings = { branding: {} };
            viewModel.selectedTheme = { title: 'default', settings: {} };

            viewModel.saveSettings();

            expect(saveCommand.saveCourseTemplateSettings).toHaveBeenCalledWith('courseId', 'templateId', { branding: {} }, { preset: 'default' });
        });

        describe('when settings were not saved', () => {

            beforeEach(() => {
                spyOn(saveCommand, 'saveCourseTemplateSettings').and.returnValue(Promise.reject());
            });

            it('should show notification error', done => {
                viewModel.saveSettings({}).then(() => {
                    expect(notify.error).toHaveBeenCalled();
                    done();
                });
            });

        });

        describe('when settings were saved successfully', () => {

            beforeEach(() => {
                spyOn(saveCommand, 'saveCourseTemplateSettings').and.returnValue(Promise.resolve());
            });

            it('should show notification success', done => {
                viewModel.saveSettings({}).then(() => {
                    expect(notify.saved).toHaveBeenCalled();
                    done();
                });
            });

            it('should reload preview', done => {
                spyOn(viewModel, 'reloadPreview');
                viewModel.saveSettings({}).then(() => {
                    expect(viewModel.reloadPreview).toHaveBeenCalled();
                    done();
                });
            });

        });

    });

    describe('brandingSettingsChanged:', () => {

        beforeEach(() => {
            viewModel.courseId = 'courseId';
            viewModel.template({ id: 'id' });

            spyOn(viewModel, 'saveSettings').and.returnValue(Promise.resolve());
        });

        it('should update logo', done => {
            spyOn(saveCommand, 'saveCourseTemplateSettings').and.returnValue(Promise.resolve({}));

            viewModel.brandingTab = new BrandingTab();
            viewModel.brandingTab.logo.imageUrl('imageUrl');

            viewModel.brandingSettingsChanged().then(() => {
                expect(viewModel.settings.branding.logo.url).toEqual('imageUrl');
                done();
            });
        });

        it('should update colors', done => {
            spyOn(saveCommand, 'saveCourseTemplateSettings').and.returnValue(Promise.resolve({}));
            
            viewModel.brandingTab = new BrandingTab();

            viewModel.brandingTab.colors.colors([{ key: 'key1', value: ko.observable('value1') }, { key: 'key2', value: ko.observable('value2') }]);

            viewModel.brandingSettingsChanged().then(() => {
                expect(viewModel.settings.branding.colors).toBeArray();
                expect(viewModel.settings.branding.colors.length).toEqual(2);
                expect(viewModel.settings.branding.colors[0].key).toEqual('key1');
                expect(viewModel.settings.branding.colors[0].value).toEqual('value1');
                expect(viewModel.settings.branding.colors[1].key).toEqual('key2');
                expect(viewModel.settings.branding.colors[1].value).toEqual('value2');
                done();
            });
        });

        describe('when top background has color selected', () => {

            beforeEach(() => {
                spyOn(saveCommand, 'saveCourseTemplateSettings').and.returnValue(Promise.resolve({}));
            });

            it('should update top background color', done => {
                viewModel.brandingTab = new BrandingTab();
                viewModel.brandingTab.colors.colors([{ key: 'key1', value: ko.observable('value1') }, { key: 'key2', value: ko.observable('value2') }]);
                viewModel.brandingTab.background.header.brightness(0.3);
                viewModel.brandingTab.background.header.color('#aabbcc');
                viewModel.brandingTab.background.header.image(null);


                viewModel.brandingSettingsChanged().then(() => {
                    expect(viewModel.settings.branding.background.header.brightness).toEqual(0.3);
                    expect(viewModel.settings.branding.background.header.color).toEqual('#aabbcc');
                    expect(viewModel.settings.branding.background.header.image).toEqual(null);
                    done();
                });
            });

        });

        describe('when top background has image selected', () => {

            beforeEach(() => {
                spyOn(saveCommand, 'saveCourseTemplateSettings').and.returnValue(Promise.resolve({}));
            });

            it('should update header background image', done => {
                viewModel.brandingTab = new BrandingTab();
                viewModel.brandingTab.colors.colors([{ key: 'key1', value: ko.observable('value1') }, { key: 'key2', value: ko.observable('value2') }]);
                viewModel.brandingTab.background.header.brightness(0.3);
                viewModel.brandingTab.background.header.color(null);
                viewModel.brandingTab.background.header.image('imageUrl');
                viewModel.brandingTab.background.header.option('original');

                viewModel.brandingSettingsChanged().then(() => {
                    expect(viewModel.settings.branding.background.header.brightness).toEqual(0.3);
                    expect(viewModel.settings.branding.background.header.color).toEqual(null);
                    expect(viewModel.settings.branding.background.header.image.url).toEqual('imageUrl');
                    expect(viewModel.settings.branding.background.header.image.option).toEqual('original');
                    done();
                });
            });

        });

        describe('when secondary background has color selected', () => {

            beforeEach(() => {
                spyOn(saveCommand, 'saveCourseTemplateSettings').and.returnValue(Promise.resolve({}));
            });

            it('should update secondary background color', done => {
                viewModel.brandingTab = new BrandingTab();
                viewModel.brandingTab.colors.colors([{ key: 'key1', value: ko.observable('value1') }, { key: 'key2', value: ko.observable('value2') }]);
                viewModel.brandingTab.background.body.enabled(true);
                viewModel.brandingTab.background.body.brightness(0.3);
                viewModel.brandingTab.background.body.color('#aabbcc');
                viewModel.brandingTab.background.body.texture(null);

                viewModel.brandingSettingsChanged().then(() => {
                    expect(viewModel.settings.branding.background.body.enabled).toBeTruthy();
                    expect(viewModel.settings.branding.background.body.brightness).toEqual(0.3);
                    expect(viewModel.settings.branding.background.body.color).toEqual('#aabbcc');
                    expect(viewModel.settings.branding.background.body.texture).toEqual(null);
                    done();
                });
            });

        });

        describe('when secondary background has texture selected', () => {

            beforeEach(() => {
                spyOn(saveCommand, 'saveCourseTemplateSettings').and.returnValue(Promise.resolve({}));
            });

            it('should update secondary background texture', done => {
                viewModel.brandingTab = new BrandingTab();
                viewModel.brandingTab.colors.colors([{ key: 'key1', value: ko.observable('value1') }, { key: 'key2', value: ko.observable('value2') }]);
                viewModel.brandingTab.background.body.enabled(true);
                viewModel.brandingTab.background.body.brightness(0.3);
                viewModel.brandingTab.background.body.color(null);
                viewModel.brandingTab.background.body.texture('texture');

                viewModel.brandingSettingsChanged().then(() => {
                    expect(viewModel.settings.branding.background.body.enabled).toBeTruthy();
                    expect(viewModel.settings.branding.background.body.brightness).toEqual(0.3);
                    expect(viewModel.settings.branding.background.body.color).toEqual(null);
                    expect(viewModel.settings.branding.background.body.texture).toEqual('texture');
                    done();
                });
            });

        });

        it('it should save settings', done => {

            viewModel.brandingSettingsChanged({}).then(() => {
                expect(viewModel.saveSettings).toHaveBeenCalled();
                done();
            });
            
        });

    });

});