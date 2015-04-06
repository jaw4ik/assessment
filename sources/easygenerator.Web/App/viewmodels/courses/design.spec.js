define(['viewmodels/courses/design'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        courseRepository = require('repositories/courseRepository'),
        templateRepository = require('repositories/templateRepository'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager'),
        clientContext = require('clientContext'),
        constants = require('constants'),
        waiter = require('utils/waiter')
    ;

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

        describe('navigateToCoursesEvent:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToCoursesEvent).toBeFunction();
            });

            it('should send event \'Navigate to courses\'', function () {
                viewModel.navigateToCoursesEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
            });

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
                viewModel.displaySettings(null);
                viewModel.canDeactivate();
                expect(viewModel.displaySettings()).toBeFalsy();
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
                    viewModel.displaySettings(false);
                    var promise = viewModel.canDeactivate();
                    promise.fin(function () {
                        expect(viewModel.displaySettings()).toBeTruthy();
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
                    viewModel.displaySettings(false);
                    var promise = viewModel.canDeactivate();
                    promise.fin(function () {
                        expect(viewModel.displaySettings()).toBeTruthy();
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
                        { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], description: "Default template", previewDemoUrl: 'preview_url_default', order: 1, isNew: true, isCustom: true },
                        { id: "1", name: "Quiz", thumbnail: "path/to/image2.png", previewImages: ["path/to/previewImg.png"], description: "Quiz template", previewDemoUrl: 'preview_url_quiz', order: 0, isNew: false, isCustom: false }
                    ],
                    template = templates[1],
                    course = { id: 'courseId', template: template };

                beforeEach(function () {
                    spyOn(clientContext, 'set');
                    getCourseDefer.resolve(course);
                });

                it('should get collection of templates from repository', function (done) {
                    getTemplateCollectionDefer.reject();

                    viewModel.activate(course.id).fin(function () {
                        expect(templateRepository.getCollection).toHaveBeenCalled();
                        done();
                    });
                });

                it('should set course id as the last visited in client context', function (done) {
                    getTemplateCollectionDefer.reject();

                    viewModel.activate(course.id).fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVistedCourse, course.id);
                        done();
                    });
                });

                it('should reset last visited objective in client context', function (done) {
                    getTemplateCollectionDefer.reject();

                    viewModel.activate(course.id).fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVisitedObjective, null);
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

                        jasmine.addMatchers({
                            toBeTemplate: function () {
                                return {
                                    compare: function (actual, expected) {
                                        var expectedJson = JSON.stringify(expected);
                                        var actualJson = JSON.stringify(actual);

                                        var result = {
                                            pass: (expectedJson == actualJson)
                                        }

                                        if (result.pass) {
                                            result.message = "Ok";
                                        } else {
                                            result.message = "Expected template to be " + expectedJson + ", but it is " + actualJson;
                                        }

                                        return result;
                                    }
                                }
                            }
                        });
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

                    });

                    it('should set a list of available templates by order', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.templates[0]).toBeTemplate(templates[1]);
                            expect(viewModel.templates[1]).toBeTemplate(templates[0]);
                            done();
                        });
                    });

                    it('should set currentTemplate', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.currentTemplate()).toBeTemplate(template);
                            done();
                        });
                    });

                });

            });

        });

        describe('selectTemplate:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(waiter, 'waitFor').and.returnValue(dfd.promise);
                spyOn(notify, 'success');
                spyOn(notify, 'error');
            });

            it('should be function', function () {
                expect(viewModel.selectTemplate).toBeFunction();
            });


            describe('when template is already selected', function () {

                beforeEach(function () {
                    viewModel.courseId = 'courseId';
                });

                it('should not send event \'Change course template to \'selectedTemplateName\'\'', function () {
                    var template = { id: 'templateId' };
                    viewModel.currentTemplate(template);

                    viewModel.selectTemplate(template);

                    expect(eventTracker.publish).not.toHaveBeenCalled();
                });

                it('should not change template from repository', function () {
                    var template = { id: 'templateId' };
                    viewModel.currentTemplate(template);

                    viewModel.selectTemplate(template);

                    expect(courseRepository.updateCourseTemplate).not.toHaveBeenCalled();
                });

                it('should not wait for save template settings', function () {
                    var template = { id: 'templateId' };
                    viewModel.currentTemplate(template);

                    viewModel.selectTemplate(template);
                    expect(waiter.waitFor).not.toHaveBeenCalled();
                });

            });

            describe('when template is not yet selected', function () {

                describe('when template is custom', function () {

                    it('should send event \'Change course template to \'custom\'\'', function () {
                        viewModel.currentTemplate({ id: '' });

                        viewModel.selectTemplate({ id: 'templateId', isCustom: true });

                        expect(eventTracker.publish).toHaveBeenCalledWith('Change course template to \'custom\'');
                    });
                });

                describe('when template is default', function () {

                    it('should send event \'Change course template to \'selectedTemplateName\'\'', function () {
                        var templateName = 'templateName';
                        viewModel.currentTemplate({ id: '' });

                        viewModel.selectTemplate({ id: 'templateId', name: 'templateName' });

                        expect(eventTracker.publish).toHaveBeenCalledWith('Change course template to \'' + templateName + '\'');
                    });

                });

                it('should wait for save template settings', function () {
                    viewModel.currentTemplate({ id: '' });

                    viewModel.selectTemplate({ id: 'templateId' });
                    expect(waiter.waitFor).toHaveBeenCalled();
                });

                describe('when waiter resolve promise', function () {

                    it('should not send notification error', function (done) {
                        var templateId = 'templateId';

                        dfd.resolve();
                        viewModel.currentTemplate({ id: '' });

                        var promise = viewModel.selectTemplate({ id: templateId });
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(notify.error).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should hide template settings', function (done) {
                        var templateId = 'templateId';

                        dfd.resolve();
                        viewModel.settingsVisibility(true);
                        viewModel.currentTemplate({ id: '' });

                        var promise = viewModel.selectTemplate({ id: templateId });
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(viewModel.settingsVisibility()).toBeFalsy();
                            done();
                        });
                    });

                    it('should change course template', function (done) {
                        dfd.resolve();
                        var courseId = 'courseId';
                        var templateId = 'templateId';
                        viewModel.courseId = courseId;
                        viewModel.currentTemplate({ id: '' });

                        var promise = viewModel.selectTemplate({ id: templateId });
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(courseRepository.updateCourseTemplate).toHaveBeenCalledWith(courseId, templateId);
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
                            viewModel.currentTemplate({ id: '' });

                            var promise = viewModel.selectTemplate({ id: 'templateId' });
                            promise.fin(function () {
                                expect(notify.success).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should change current template', function (done) {
                            var template = { id: 'templateId' };
                            viewModel.currentTemplate({ id: '' });

                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(viewModel.currentTemplate()).toBe(template);
                                done();
                            });
                        });

                        it('should finish loading template', function (done) {
                            var template = { id: 'templateId' };
                            viewModel.currentTemplate({ id: '' });

                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(viewModel.loadingTemplate()).toBeFalsy();
                                done();
                            });
                        });

                    });

                });

                describe('when waiter reject promise', function () {

                    it('should send notification error', function (done) {
                        var templateId = 'templateId';

                        dfd.reject();
                        viewModel.currentTemplate({ id: '' });

                        var promise = viewModel.selectTemplate({ id: templateId });
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(notify.error).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should hide template settings', function (done) {
                        var templateId = 'templateId';

                        dfd.reject();
                        viewModel.settingsVisibility(true);
                        viewModel.currentTemplate({ id: '' });

                        var promise = viewModel.selectTemplate({ id: templateId });
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(viewModel.settingsVisibility()).toBeFalsy();
                            done();
                        });
                    });

                    it('should change course template', function (done) {
                        dfd.reject();
                        var courseId = 'courseId';
                        var templateId = 'templateId';
                        viewModel.courseId = courseId;
                        viewModel.currentTemplate({ id: '' });

                        var promise = viewModel.selectTemplate({ id: templateId });
                        updateCourseTemplateDefer.resolve();
                        promise.fin(function () {
                            expect(courseRepository.updateCourseTemplate).toHaveBeenCalledWith(courseId, templateId);
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
                            viewModel.currentTemplate({ id: '' });

                            var promise = viewModel.selectTemplate({ id: 'templateId' });
                            promise.fin(function () {
                                expect(notify.success).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should change current template', function (done) {
                            var template = { id: 'templateId' };
                            viewModel.currentTemplate({ id: '' });

                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(viewModel.currentTemplate()).toBe(template);
                                done();
                            });
                        });

                        it('should finish loading template', function (done) {
                            var template = { id: 'templateId' };
                            viewModel.currentTemplate({ id: '' });

                            var promise = viewModel.selectTemplate(template);
                            promise.fin(function () {
                                expect(viewModel.loadingTemplate()).toBeFalsy();
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

        describe('currentTemplate:', function () {

            it('should be observable', function () {
                expect(viewModel.currentTemplate).toBeObservable();
            });

        });

        describe('loadingTemplate:', function () {

            it('should be observable', function () {
                expect(viewModel.loadingTemplate).toBeObservable();
            });

        });

        describe('settingsSaved:', function () {

            it('should be observable', function () {
                expect(viewModel.settingsSaved).toBeObservable();
            });

        });

        describe('templates:', function () {

            it('should be defined', function () {
                expect(viewModel.templates).toBeDefined();
            });

        });

        describe('frameLoaded:', function () {

            it('should be function', function () {
                expect(viewModel.frameLoaded).toBeFunction();
            });

            it('should show template settings', function () {
                viewModel.settingsVisibility(false);
                viewModel.frameLoaded();
                expect(viewModel.settingsVisibility()).toBeTruthy();
            });

            it('shoul set save state for template settings', function () {
                viewModel.settingsSaved(false);
                viewModel.frameLoaded();
                expect(viewModel.settingsSaved()).toBeTruthy();
            });

        });

        describe('templatesListCollapsed:', function () {

            it('should be observable', function () {
                expect(viewModel.templatesListCollapsed).toBeObservable();
            });

        });

        describe('toggleTemplatesListVisibility:', function () {

            it('should be function', function () {
                expect(viewModel.toggleTemplatesListVisibility).toBeFunction();
            });

            describe('when templates list is not collapsed', function () {

                it('should collapse templates list', function () {
                    viewModel.templatesListCollapsed(false);
                    viewModel.toggleTemplatesListVisibility();
                    expect(viewModel.templatesListCollapsed()).toBeTruthy();
                });

            });

            describe('when templates list is collapsed', function () {

                it('should expand templates list', function () {
                    viewModel.templatesListCollapsed(true);
                    viewModel.toggleTemplatesListVisibility();
                    expect(viewModel.templatesListCollapsed()).toBeFalsy();
                });

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

                beforeEach(function() {
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

            describe('when message object have freeze type', function () {

                beforeEach(function () {
                    message = { type: 'freeze' };
                });

                describe('when data.freezeEditor is true', function() {

                    beforeEach(function() {
                        message.data = {
                            freezeEditor: true
                        };
                    });

                    it('should set settings into not saved state', function () {
                        viewModel.settingsSaved(true);
                        viewModel.onGetTemplateMessage(message);
                        expect(viewModel.settingsSaved()).toBeFalsy();
                    });

                });

                describe('when data.freezeEditor is false', function () {

                    beforeEach(function () {
                        message.data = {
                            freezeEditor: false
                        };
                    });

                    it('should set settings into saved state', function () {
                        viewModel.settingsSaved(false);
                        viewModel.onGetTemplateMessage(message);
                        expect(viewModel.settingsSaved()).toBeTruthy();
                    });

                });
                
                describe('when data.freezeEditor is empty', function () {

                    beforeEach(function () {
                        message.data = {};
                    });

                    it('should set settings into saved state', function () {
                        viewModel.settingsSaved(false);
                        viewModel.onGetTemplateMessage(message);
                        expect(viewModel.settingsSaved()).toBeTruthy();
                    });

                });

            });

            describe('when message object have notification type', function () {

                beforeEach(function () {
                    message = { type: 'notification' };
                });

                describe('when data.success is true', function () {

                    beforeEach(function () {
                        message.data = {
                            success: true
                        };
                    });

                    describe('and when message exists', function() {

                        beforeEach(function() {
                            message.data.message = "Message text";
                        });

                        it('should show success notification', function() {
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

            describe('when message object have startSave type', function () {

                beforeEach(function () {
                    message = { type: 'startSave', data: {} };
                });

                it('should not send error notification message', function () {
                    viewModel.onGetTemplateMessage(message);
                    expect(notify.error).not.toHaveBeenCalled();
                });

                it('should not send success notification message', function () {
                    viewModel.onGetTemplateMessage(message);
                    expect(notify.success).not.toHaveBeenCalled();
                });

                it('should set settings into not save state', function () {
                    viewModel.settingsSaved(true);
                    viewModel.onGetTemplateMessage(message);
                    expect(viewModel.settingsSaved()).toBeFalsy();
                });

            });

            describe('when message object have finishSave type', function () {

                beforeEach(function () {
                    message = { type: 'finishSave' };
                });

                describe('and message have not data', function () {

                    beforeEach(function () {
                        message.data = null;
                    });

                    it('should not send error notification message', function () {
                        viewModel.onGetTemplateMessage(message);
                        expect(notify.error).not.toHaveBeenCalled();
                    });

                    it('should not send success notification message', function () {
                        viewModel.onGetTemplateMessage(message);
                        expect(notify.error).not.toHaveBeenCalled();
                    });

                });

                describe('and message object have data', function () {

                    beforeEach(function () {
                        message.data = {};
                    });

                    it('should set settings into save state', function () {
                        viewModel.settingsSaved(false);
                        viewModel.onGetTemplateMessage(message);
                        expect(viewModel.settingsSaved()).toBeTruthy();
                    });

                    describe('and data have success type', function () {

                        beforeEach(function () {
                            message.data.success = true;
                        });

                        describe('and data have message', function () {

                            beforeEach(function () {
                                message.data.message = 'All changes are saved';
                            });

                            it('should send success notification message', function () {
                                viewModel.onGetTemplateMessage(message);
                                expect(notify.success).toHaveBeenCalledWith(message.data.message);
                            });

                        });

                        describe('and data have not message', function () {

                            beforeEach(function () {
                                message.data.message = null;
                            });

                            it('should send saved notification message', function () {
                                viewModel.onGetTemplateMessage(message);
                                expect(notify.saved).toHaveBeenCalled();
                            });

                        });

                    });

                    describe('and data have not success type', function () {

                        beforeEach(function () {
                            message.data.success = false;
                        });

                        describe('and data have message', function () {

                            beforeEach(function () {
                                message.data.message = 'All changes are saved';
                            });

                            it('should send error notification message', function () {
                                viewModel.onGetTemplateMessage(message);
                                expect(notify.error).toHaveBeenCalledWith(message.data.message);
                            });

                        });

                        describe('and data have not message', function () {

                            beforeEach(function () {
                                message.data.message = null;
                            });

                            it('should send error notification message', function () {
                                viewModel.onGetTemplateMessage(message);
                                expect(notify.error).toHaveBeenCalled();
                            });

                        });

                    });

                });

            });

        });

    });

});
