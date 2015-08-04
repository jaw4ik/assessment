define(['viewmodels/courses/course/design/design'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        notify = require('notify'),
        courseRepository = require('repositories/courseRepository'),
        templateRepository = require('repositories/templateRepository'),
        waiter = require('utils/waiter');

    describe('viewModel [design]', function () {

        var
            getCourseDefer,
            updateCourseTemplateDefer,
            getTemplateCollectionDefer;

        beforeEach(function () {
            getCourseDefer = Q.defer();
            getTemplateCollectionDefer = Q.defer();
            updateCourseTemplateDefer = Q.defer();

            spyOn(courseRepository, 'getById').and.returnValue(getCourseDefer.promise);
            spyOn(courseRepository, 'updateCourseTemplate').and.returnValue(updateCourseTemplateDefer.promise);
            spyOn(templateRepository, 'getCollection').and.returnValue(getTemplateCollectionDefer.promise);

            spyOn(router, 'replace');
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'saved');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('canDeactivate:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(waiter, 'waitFor').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(viewModel.canDeactivate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.canDeactivate()).toBePromise();
            });

            it('should wait for save template settings', function () {
                viewModel.canDeactivate();
                expect(waiter.waitFor).toHaveBeenCalled();
            });

            it('should hide template settings', function () {
                viewModel.settingsVisibility(null);
                viewModel.canDeactivate();
                expect(viewModel.settingsVisibility()).toBeFalsy();
            });

            describe('when settings are saved', function () {

                it('should resolve promise', function (done) {
                    dfd.resolve();
                    var promise = viewModel.canDeactivate();
                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

                it('should show template settings', function (done) {
                    dfd.resolve();
                    viewModel.settingsVisibility(false);
                    var promise = viewModel.canDeactivate();
                    promise.fin(function () {
                        expect(viewModel.settingsVisibility()).toBeTruthy();
                        done();
                    });

                });

            });

            describe('when settings are not saved', function () {

                it('should send notification error', function (done) {
                    dfd.reject();
                    var promise = viewModel.canDeactivate();
                    promise.fin(function () {
                        done();
                        expect(notify.error).toHaveBeenCalled();
                    });
                });

                it('should resolve promise', function (done) {
                    dfd.reject();
                    var promise = viewModel.canDeactivate();
                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

                it('should show template settings', function (done) {
                    dfd.reject();
                    viewModel.settingsVisibility(false);
                    var promise = viewModel.canDeactivate();
                    promise.fin(function () {
                        expect(viewModel.settingsVisibility()).toBeTruthy();
                        done();
                    });

                });

            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should set settingsVisibility to false', function () {
                viewModel.settingsVisibility(true);
                viewModel.activate();
                expect(viewModel.settingsVisibility()).toBeFalsy();
            });

            it('should get course from repository', function () {
                var courseId = 'courseId';
                viewModel.activate(courseId);
                expect(courseRepository.getById).toHaveBeenCalledWith(courseId);
            });

            describe('when course was not found', function () {

                beforeEach(function () {
                    getCourseDefer.reject('reason');
                });

                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                    router.activeItem.settings.lifecycleData = null;

                    viewModel.activate('courseId').fin(function () {
                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                        done();
                    });
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.activate('courseId');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('reason');
                        done();
                    });
                });
            });

            describe('when course exists', function () {

                var
                    templates = [
                        { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], description: "Default template", previewDemoUrl: 'preview_url_default', settingsUrls: { design: null, configure: null }, order: 1, isNew: true, isCustom: true, loadingTemplate: ko.observable(false) },
                        { id: "1", name: "Quiz", thumbnail: "path/to/image2.png", previewImages: ["path/to/previewImg.png"], description: "Quiz template", previewDemoUrl: 'preview_url_quiz', settingsUrls: { design: null, configure: null }, order: 0, isNew: false, isCustom: false, loadingTemplate: ko.observable(false) }
                    ],
                    template = templates[1],
                    course = { id: 'courseId', template: template };

                beforeEach(function () {
                    getCourseDefer.resolve(course);
                });

                it('should publish navigate to templates event', function (done) {
                    getTemplateCollectionDefer.reject();

                    viewModel.activate(course.id).fin(function () {
                        expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to \'choose template\' section', 'Design step');
                        done();
                    });

                });

                it('should set templatesSectionSelected to true', function (done) {
                    getTemplateCollectionDefer.reject();
                    viewModel.templatesSectionSelected(false);

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.templatesSectionSelected()).toBeTruthy();
                        done();
                    });

                });

                it('should set previewUrl', function (done) {
                    getTemplateCollectionDefer.reject();

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.previewUrl()).toBe('/preview/' + course.id);
                        done();
                    });

                });

                it('should get collection of templates from repository', function (done) {
                    getTemplateCollectionDefer.reject();

                    viewModel.activate(course.id).fin(function () {
                        expect(templateRepository.getCollection).toHaveBeenCalled();
                        done();
                    });
                });

                describe('and an error occured when getting templates', function () {

                    beforeEach(function () {
                        getTemplateCollectionDefer.reject('reason');
                    });

                    it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                        router.activeItem.settings.lifecycleData = null;

                        viewModel.activate(course.id).fin(function () {
                            expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                            done();
                        });
                    });

                    it('should reject promise', function (done) {
                        var promise = viewModel.activate(course.id);

                        promise.fin(function () {
                            expect(promise).toBeRejectedWith('reason');
                            done();
                        });
                    });

                });

                describe('and got templates', function () {

                    beforeEach(function () {
                        getTemplateCollectionDefer.resolve(templates);
                    });

                    describe('should map templates:', function () {

                        beforeEach(function (done) {
                            viewModel.activate().fin(function () {
                                template = viewModel.templates[0];
                                done();
                            });
                        });

                        describe('id:', function () {

                            it('should be defined', function () {
                                expect(template.id).toBeDefined();
                            });

                        });

                        describe('name:', function () {

                            it('should be defined', function () {
                                expect(template.name).toBeDefined();
                            });

                        });

                        describe('description:', function () {

                            it('should be defined', function () {
                                expect(template.description).toBeDefined();
                            });

                        });

                        describe('isNew:', function () {

                            it('should be defined', function () {
                                expect(template.isNew).toBeDefined();
                            });

                        });

                        describe('isCustom:', function () {

                            it('should be defined', function () {
                                expect(template.isNew).toBeDefined();
                            });

                        });

                        describe('thumbnail:', function () {

                            it('should be defined', function () {
                                expect(template.thumbnail).toBeDefined();
                            });

                        });

                        describe('previewImages:', function () {

                            it('should be array', function () {
                                expect(template.previewImages.length).toBeDefined();
                            });

                        });

                        describe('openPreview:', function () {

                            var event = {
                                stopPropagation: function () { }
                            };

                            beforeEach(function () {
                                spyOn(event, 'stopPropagation');
                                spyOn(router, 'openUrl').and.callFake(function () { });
                            });

                            it('should be function', function () {
                                expect(template.openPreview).toBeFunction();
                            });

                            it('should stop propagation', function () {
                                template.openPreview(template, event);
                                expect(event.stopPropagation).toHaveBeenCalled();
                            });

                            it('should open template preview in new tab', function () {
                                template.openPreview(template, event);
                                var previewUrl = router.openUrl.calls.mostRecent().args[0];
                                var url = previewUrl.substring(0, previewUrl.indexOf('?'));
                                expect(url).toBe(template.previewDemoUrl);
                            });

                        });

                        describe('designSettingsUrl:', function () {

                            it('should be defined', function () {
                                expect(template.designSettingsUrl).toBeDefined();
                            });

                        });

                        describe('settingsAvailable:', function () {

                            it('should be defined', function () {
                                expect(template.settingsAvailable).toBeDefined();
                            });

                        });

                        describe('loadingTemplate:', function () {

                            it('should be defined', function () {
                                expect(template.loadingTemplate).toBeDefined();
                            });

                        });

                    });

                    it('should set a list of available templates by order', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.templates[0].id).toBe(templates[1].id);
                            expect(viewModel.templates[1].id).toBe(templates[0].id);
                            done();
                        });
                    });

                    it('should set currentTemplate', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.currentTemplate().id).toBe(template.id);
                            done();
                        });
                    });

                });

            });

        });

        describe('selectTemplate:', function () {

            var dfd, template;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(waiter, 'waitFor').and.returnValue(dfd.promise);
                spyOn(notify, 'success');
                spyOn(notify, 'error');

                template = { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], description: "Default template", previewDemoUrl: 'preview_url_default', settingsUrls: { design: null, configure: null }, order: 1, isNew: false, isCustom: false, loadingTemplate: ko.observable(false) };
            });

            it('should be function', function () {
                expect(viewModel.selectTemplate).toBeFunction();
            });


            describe('when template is already selected', function () {

                beforeEach(function () {
                    viewModel.courseId = 'courseId';
                    viewModel.currentTemplate(template);
                });

                it('should not send event \'Change course template to \'selectedTemplateName\'\'', function () {
                    viewModel.selectTemplate(template);

                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });

                it('should not change template from repository', function () {
                    viewModel.selectTemplate(template);

                    expect(courseRepository.updateCourseTemplate).not.toHaveBeenCalled();
                });

                it('should not wait for save template settings', function () {
                    viewModel.selectTemplate(template);

                    expect(waiter.waitFor).not.toHaveBeenCalled();
                });

            });

            describe('when template is not yet selected', function () {

                describe('when template is custom', function () {

                    it('should send event \'Change course template to \'custom\'\'', function () {
                        template.isCustom = true;

                        viewModel.selectTemplate(template);

                        expect(eventTracker.publish).toHaveBeenCalledWith('Change course template to \'custom\'');
                    });
                });

                describe('when template is default', function () {

                    it('should send event \'Change course template to \'selectedTemplateName\'\'', function () {
                        viewModel.selectTemplate(template);

                        expect(eventTracker.publish).toHaveBeenCalledWith('Change course template to \'' + template.name + '\'');
                    });

                });

                it('should wait for save template settings', function () {
                    viewModel.selectTemplate(template);

                    expect(waiter.waitFor).toHaveBeenCalled();
                });

                describe('when waiter resolve promise', function () {

                    it('should not send notification error', function (done) {
                        dfd.resolve();

                        var promise = viewModel.selectTemplate(template);
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(notify.error).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should hide template settings', function (done) {
                        dfd.resolve();

                        viewModel.settingsVisibility(true);

                        var promise = viewModel.selectTemplate(template);
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(viewModel.settingsVisibility()).toBeFalsy();
                            done();
                        });
                    });

                    it('should change course template', function (done) {
                        dfd.resolve();

                        var courseId = 'courseId';
                        viewModel.courseId = courseId;

                        var promise = viewModel.selectTemplate(template);
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(courseRepository.updateCourseTemplate).toHaveBeenCalledWith(courseId, template.id);
                            done();
                        });
                    });

                    describe('and template was changed', function () {

                        var modifiedOn;

                        beforeEach(function () {
                            modifiedOn = new Date();
                            dfd.resolve();
                            updateCourseTemplateDefer.resolve({ modifiedOn: modifiedOn });
                        });

                        it('should show update notification', function (done) {
                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(notify.success).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should change current template', function (done) {
                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(viewModel.currentTemplate()).toBe(template);
                                done();
                            });
                        });

                        it('should finish loading template', function (done) {
                            template.loadingTemplate(true);
                            viewModel.loadingTemplate(true);

                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(template.loadingTemplate()).toBeFalsy();
                                expect(viewModel.loadingTemplate()).toBeFalsy();
                                done();
                            });
                        });

                    });

                });

                describe('when waiter reject promise', function () {

                    it('should send notification error', function (done) {
                        dfd.reject();

                        var promise = viewModel.selectTemplate(template);
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(notify.error).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should hide template settings', function (done) {
                        dfd.reject();

                        viewModel.settingsVisibility(true);

                        var promise = viewModel.selectTemplate(template);
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(viewModel.settingsVisibility()).toBeFalsy();
                            done();
                        });
                    });

                    it('should change course template', function (done) {
                        dfd.reject();

                        var courseId = 'courseId';
                        viewModel.courseId = courseId;

                        var promise = viewModel.selectTemplate(template);
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(courseRepository.updateCourseTemplate).toHaveBeenCalledWith(courseId, template.id);
                            done();
                        });
                    });

                    describe('and template was changed', function () {

                        var modifiedOn;

                        beforeEach(function () {
                            modifiedOn = new Date();
                            dfd.reject();
                            updateCourseTemplateDefer.resolve({ modifiedOn: modifiedOn });
                        });

                        it('should show update notification', function (done) {
                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(notify.success).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should change current template', function (done) {
                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(viewModel.currentTemplate()).toBe(template);
                                done();
                            });
                        });

                        it('should finish loading template', function (done) {
                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(template.loadingTemplate()).toBeFalsy();
                                done();
                            });
                        });

                    });

                });

            });

        });

        describe('courseId:', function () {

            it('should be defined', function () {
                expect(viewModel.courseId).toBeDefined();
            });

        });

        describe('previewUrl:', function () {

            it('should be observable', function () {
                expect(viewModel.previewUrl).toBeObservable();
            });

        });

        describe('loadingTemplate:', function () {

            it('should be observable', function () {
                expect(viewModel.loadingTemplate).toBeObservable();
            });

        });

        describe('currentTemplate:', function () {

            it('should be observable', function () {
                expect(viewModel.currentTemplate).toBeObservable();
            });

        });

        describe('canUnloadSettings:', function () {

            it('should be observable', function () {
                expect(viewModel.canUnloadSettings).toBeObservable();
            });

        });

        describe('templates:', function () {

            it('should be defined', function () {
                expect(viewModel.templates).toBeDefined();
            });

        });

        describe('reloadPreview:', function () {

            beforeEach(function () {
                spyOn(viewModel.previewUrl, 'valueHasMutated');
            });

            it('should be function', function () {
                expect(viewModel.reloadPreview).toBeFunction();
            });

            it('should reset previewUrl', function () {
                viewModel.reloadPreview();
                expect(viewModel.previewUrl.valueHasMutated).toHaveBeenCalled();
            });

        });

        describe('templatesSectionSelected:', function () {

            it('should be observable', function () {
                expect(viewModel.templatesSectionSelected).toBeObservable();
            });

        });

        describe('selectTemplatesSection', function () {

            it('should be function', function () {
                expect(viewModel.selectTemplatesSection).toBeFunction();
            });

            it('should set settingsVisibility to false', function () {
                viewModel.settingsVisibility(true);
                viewModel.selectTemplatesSection();
                expect(viewModel.settingsVisibility()).toBeFalsy();
            });

            it('should set templatesSectionSelected to true', function () {
                viewModel.templatesSectionSelected(false);
                viewModel.selectTemplatesSection();
                expect(viewModel.templatesSectionSelected()).toBeTruthy();
            });

            it('should publish navigate to templates event', function () {
                viewModel.selectTemplatesSection();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to \'choose template\' section', 'Design step');
            });

        });

        describe('selectSettingsSection', function () {

            it('should be function', function () {
                expect(viewModel.selectSettingsSection).toBeFunction();
            });

            it('should set templatesSectionSelected to false', function () {
                viewModel.templatesSectionSelected(true);
                viewModel.selectSettingsSection();
                expect(viewModel.templatesSectionSelected()).toBeFalsy();
            });

            it('should publish navigate to settings event', function () {
                viewModel.selectSettingsSection();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to \'design settings\' section', 'Design step');
            });

        });

        describe('settingsFrameLoaded:', function () {

            it('should be function', function () {
                expect(viewModel.settingsFrameLoaded).toBeFunction();
            });

            it('shoul set save state for template settings', function () {
                viewModel.canUnloadSettings(false);
                viewModel.settingsFrameLoaded();
                expect(viewModel.canUnloadSettings()).toBeTruthy();
            });

        });

        describe('onGetTemplateMessage', function () {

            beforeEach(function () {
                spyOn(notify, 'success');
                spyOn(notify, 'error');
            });

            it('should be function', function () {
                expect(viewModel.onGetTemplateMessage).toBeFunction();
            });

            var message;
            describe('when message object is empty', function () {

                beforeEach(function () {
                    message = null;
                });

                it('should not send error notification', function () {
                    viewModel.onGetTemplateMessage(message);
                    expect(notify.error).not.toHaveBeenCalled();
                });

                it('should not send success notification', function () {
                    viewModel.onGetTemplateMessage(message);
                    expect(notify.success).not.toHaveBeenCalled();
                });

            });

            describe('when message object have \'show-settings\' type', function () {

                beforeEach(function () {
                    message = { type: 'show-settings' };
                });

                it('should set settingsVisibility to true', function () {
                    viewModel.settingsVisibility(false);
                    viewModel.onGetTemplateMessage(message);
                    expect(viewModel.settingsVisibility()).toBeTruthy();
                });

            });

            describe('when message object have \'freeze-editor\' type', function () {

                beforeEach(function () {
                    message = { type: 'freeze-editor' };
                });

                it('should set settings into not saved state', function () {
                    viewModel.canUnloadSettings(true);
                    viewModel.onGetTemplateMessage(message);
                    expect(viewModel.canUnloadSettings()).toBeFalsy();
                });

            });

            describe('when message object have \'unfreeze-editor\' type', function () {

                beforeEach(function () {
                    message = { type: 'unfreeze-editor' };
                });

                it('should set settings into saved state', function () {
                    viewModel.canUnloadSettings(false);
                    viewModel.onGetTemplateMessage(message);
                    expect(viewModel.canUnloadSettings()).toBeTruthy();
                });

            });

            describe('when message object have \'notification\' type', function () {

                beforeEach(function () {
                    message = { type: 'notification' };
                });

                describe('when data.success is true', function () {

                    beforeEach(function () {
                        message.data = {
                            success: true
                        };

                        spyOn(viewModel, 'reloadPreview');
                    });

                    it('should reload preview', function () {
                        viewModel.onGetTemplateMessage(message);
                        expect(viewModel.reloadPreview).toHaveBeenCalled();
                    });

                    describe('and when message exists', function () {

                        beforeEach(function () {
                            message.data.message = "Message text";
                        });

                        it('should show success notification', function () {
                            viewModel.onGetTemplateMessage(message);
                            expect(notify.success).toHaveBeenCalledWith(message.data.message);
                        });

                    });

                    describe('and when message does not exist', function () {

                        beforeEach(function () {
                            message.data.message = null;
                        });

                        it('should show saved notification', function () {
                            viewModel.onGetTemplateMessage(message);
                            expect(notify.saved).toHaveBeenCalled();
                        });

                    });

                });

                describe('when data.success is false', function () {

                    beforeEach(function () {
                        message.data = {
                            success: false
                        };
                    });

                    describe('and when message exists', function () {

                        beforeEach(function () {
                            message.data.message = "Message text";
                        });

                        it('should show error notification', function () {
                            viewModel.onGetTemplateMessage(message);
                            expect(notify.error).toHaveBeenCalledWith(message.data.message);
                        });

                    });

                    describe('and when message does not exist', function () {

                        beforeEach(function () {
                            message.data.message = null;
                        });

                        it('should show error notification with default text', function () {
                            viewModel.onGetTemplateMessage(message);
                            expect(notify.error).toHaveBeenCalled();
                        });

                    });

                });

            });

        });

    });

});
