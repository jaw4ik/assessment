define(['viewmodels/courses/course/design/design'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        notify = require('notify'),
        courseRepository = require('repositories/courseRepository'),
        templateRepository = require('repositories/templateRepository'),
        waiter = require('utils/waiter'),
        templateBrief = require('viewmodels/courses/course/design/templateBrief'),
        constants = require('constants'),
        app = require('durandal/app')
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
            spyOn(app, 'on');
            spyOn(app, 'off');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('settingsLoadingTimeoutId:', function () {

            it('should be defined', function () {
                expect(viewModel.settingsLoadingTimeoutId).toBeDefined();
            });

        });

        describe('settingsVisibilitySubscription:', function () {

            it('should be defined', function () {
                expect(viewModel.settingsVisibilitySubscription).toBeDefined();
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

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should set settingsVisibility to false', function () {
                viewModel.settingsVisibility(true);
                viewModel.activate();
                expect(viewModel.settingsVisibility()).toBeFalsy();
            });

            it('should subscribe to settingsVisibility', function () {
                viewModel.settingsVisibilitySubscription = null;
                viewModel.activate();
                expect(viewModel.settingsVisibilitySubscription).not.toBeNull();
            });

            describe('and after subscribe', function () {

                it('should clear timeout when settingsVisibility changed', function () {
                    viewModel.settingsVisibility(false);
                    viewModel.settingsLoadingTimeoutId = 'some_id';

                    viewModel.activate();
                    viewModel.settingsVisibility(true);

                    expect(viewModel.settingsLoadingTimeoutId).toBeNull();
                });

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

                it('should set courseId', function (done) {
                    viewModel.courseId = null;
                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.courseId).toBe(course.id);
                        done();
                    });
                });

                it('should publish navigate to templates event', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to \'choose template\' section', 'Design step');
                        done();
                    });
                });

                it('should set previewUrl', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.previewUrl()).toBe('/preview/' + course.id);
                        done();
                    });
                });

                it('should set template', function (done) {
                    viewModel.template(null);
                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.template()).toBeDefined();
                        done();
                    });
                });

                it('should subscribe to templateUpdated event', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.course.templateUpdated + course.id, viewModel.templateUpdated);
                        done();
                    });
                });

                it('should subscribe to templateUpdatedByCollaborator event', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.course.templateUpdatedByCollaborator, viewModel.templateUpdatedByCollaborator);
                        done();
                    });
                });

            });

        });

        describe('deactivate:', function () {

            it('should be function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            describe('when settingsVisibilitySubscription is not null', function () {

                beforeEach(function () {
                    viewModel.settingsVisibilitySubscription = {
                        dispose: jasmine.createSpy()
                    };
                });

                it('should dispose subscription', function () {
                    viewModel.deactivate();
                    expect(viewModel.settingsVisibilitySubscription.dispose).toHaveBeenCalled();
                });

            });

            it('should unsubscribe from templateUpdated event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.templateUpdated + viewModel.courseId, viewModel.templateUpdated);
            });

            it('should unsubscribe from templateUpdatedByCollaborator event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.templateUpdatedByCollaborator, viewModel.templateUpdatedByCollaborator);
            });

        });

        describe('templateUpdated:', function () {

            var dfd, template;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(waiter, 'waitFor').and.returnValue(dfd.promise);
                spyOn(notify, 'success');
                spyOn(notify, 'error');

                template = {
                    id: "0",
                    name: "Default",
                    thumbnail: "path/to/image1.png",
                    previewImages: ["path/to/previewImg.png"],
                    description: "Default template",
                    previewDemoUrl: 'preview_url_default',
                    settingsUrls: { design: null, configure: null }, order: 1, isNew: false, isCustom: false, loadingTemplate: ko.observable(false)
                };
            });

            describe('when template is current template', function () {
                beforeEach(function () {
                    viewModel.template(template);
                });

                it('should not wait for load template settings', function () {
                    viewModel.templateUpdated(template);
                    expect(waiter.waitFor).not.toHaveBeenCalled();
                });
            });

            describe('when template is not current template', function () {
                var currentTemplate = { id: 'someId', loadingTemplate: ko.observable() };
                beforeEach(function () {
                    viewModel.template(currentTemplate);
                });

                it('should mark template as loading', function () {
                    currentTemplate.loadingTemplate(false);
                    viewModel.templateUpdated(template);

                    expect(currentTemplate.loadingTemplate()).toBeTruthy();
                });

                it('should mark as loading template', function () {
                    viewModel.loadingTemplate(false);
                    viewModel.templateUpdated(template);

                    expect(viewModel.loadingTemplate()).toBeTruthy();
                });

                it('should wait for save template settings', function () {
                    viewModel.templateUpdated(template);

                    expect(waiter.waitFor).toHaveBeenCalled();
                });

                describe('when waiter successed', function () {
                    beforeEach(function () {
                        dfd.resolve();
                    });

                    it('should hide template settings', function (done) {
                        viewModel.settingsVisibility(true);

                        viewModel.templateUpdated(template).fin(function () {
                            expect(viewModel.settingsVisibility()).toBeFalsy();
                            done();
                        });
                    });

                    it('should set loadingTemplate to false', function (done) {
                        viewModel.loadingTemplate(true);

                        viewModel.templateUpdated(template).fin(function () {
                            expect(viewModel.loadingTemplate()).toBeFalsy();
                            done();
                        });
                    });

                    it('should update template', function (done) {
                        viewModel.template(currentTemplate);

                        viewModel.templateUpdated(template).fin(function () {
                            expect(viewModel.template().id).toBe(template.id);
                            done();
                        });
                    });
                });

                describe('when waiter failed', function () {
                    beforeEach(function () {
                        dfd.reject();
                    });

                    it('should send notification error', function (done) {
                        viewModel.templateUpdated(template).fin(function () {
                            expect(notify.error).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should hide template settings', function (done) {
                        viewModel.settingsVisibility(true);

                        viewModel.templateUpdated(template).fin(function () {
                            expect(viewModel.settingsVisibility()).toBeFalsy();
                            done();
                        });
                    });

                    it('should set loadingTemplate to false', function (done) {
                        viewModel.loadingTemplate(true);

                        viewModel.templateUpdated(template).fin(function () {
                            expect(viewModel.loadingTemplate()).toBeFalsy();
                            done();
                        });
                    });

                    it('should update template', function (done) {
                        viewModel.template(currentTemplate);

                        viewModel.templateUpdated(template).fin(function () {
                            expect(viewModel.template().id).toBe(template.id);
                            done();
                        });
                    });
                });
            });
        });

        describe('templateUpdatedByCollaborator:', function () {

            var dfd, template, course;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(waiter, 'waitFor').and.returnValue(dfd.promise);
                spyOn(notify, 'error');

                template = {
                    id: "0",
                    name: "Default",
                    thumbnail: "path/to/image1.png",
                    previewImages: ["path/to/previewImg.png"],
                    description: "Default template",
                    previewDemoUrl: 'preview_url_default',
                    settingsUrls: { design: null, configure: null }, order: 1, isNew: false, isCustom: false, loadingTemplate: ko.observable(false)
                };

                course = { template: template, id: 'courseId' };
            });

            describe('when course is current course', function () {
                beforeEach(function() {
                    viewModel.courseId = course.id;
                });

                describe('when template is current template', function () {
                    beforeEach(function () {
                        viewModel.template(template);
                    });

                    it('should not wait for load template settings', function () {
                        viewModel.templateUpdated(template);
                        expect(waiter.waitFor).not.toHaveBeenCalled();
                    });
                });

                describe('when template is not current template', function () {
                    var currentTemplate = { id: 'someId', loadingTemplate: ko.observable() };
                    beforeEach(function () {
                        viewModel.template(currentTemplate);
                    });

                    it('should mark template as loading', function () {
                        currentTemplate.loadingTemplate(false);
                        viewModel.templateUpdated(template);

                        expect(currentTemplate.loadingTemplate()).toBeTruthy();
                    });

                    it('should mark as loading template', function () {
                        viewModel.loadingTemplate(false);
                        viewModel.templateUpdated(template);

                        expect(viewModel.loadingTemplate()).toBeTruthy();
                    });

                    it('should wait for save template settings', function () {
                        viewModel.templateUpdated(template);

                        expect(waiter.waitFor).toHaveBeenCalled();
                    });

                    describe('when waiter successed', function () {
                        beforeEach(function () {
                            dfd.resolve();
                        });

                        it('should hide template settings', function (done) {
                            viewModel.settingsVisibility(true);

                            viewModel.templateUpdated(template).fin(function () {
                                expect(viewModel.settingsVisibility()).toBeFalsy();
                                done();
                            });
                        });

                        it('should set loadingTemplate to false', function (done) {
                            viewModel.loadingTemplate(true);

                            viewModel.templateUpdated(template).fin(function () {
                                expect(viewModel.loadingTemplate()).toBeFalsy();
                                done();
                            });
                        });

                        it('should update template', function (done) {
                            viewModel.template(currentTemplate);

                            viewModel.templateUpdated(template).fin(function () {
                                expect(viewModel.template().id).toBe(template.id);
                                done();
                            });
                        });
                    });

                    describe('when waiter failed', function () {
                        beforeEach(function () {
                            dfd.reject();
                        });

                        it('should send notification error', function (done) {
                            viewModel.templateUpdated(template).fin(function () {
                                expect(notify.error).toHaveBeenCalled();
                                done();
                            });
                        });

                        it('should hide template settings', function (done) {
                            viewModel.settingsVisibility(true);

                            viewModel.templateUpdated(template).fin(function () {
                                expect(viewModel.settingsVisibility()).toBeFalsy();
                                done();
                            });
                        });

                        it('should set loadingTemplate to false', function (done) {
                            viewModel.loadingTemplate(true);

                            viewModel.templateUpdated(template).fin(function () {
                                expect(viewModel.loadingTemplate()).toBeFalsy();
                                done();
                            });
                        });

                        it('should update template', function (done) {
                            viewModel.template(currentTemplate);

                            viewModel.templateUpdated(template).fin(function () {
                                expect(viewModel.template().id).toBe(template.id);
                                done();
                            });
                        });
                    });
                });
            });

            describe('when course is not current course', function() {
                beforeEach(function () {
                    viewModel.courseId = 'some id';
                });

                it('should not wait for load template settings', function () {
                    viewModel.templateUpdated(template);
                    expect(waiter.waitFor).not.toHaveBeenCalled();
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

        describe('template:', function () {
            it('should be observable', function () {
                expect(viewModel.template).toBeObservable();
            });
        });

        describe('canUnloadSettings:', function () {
            it('should be observable', function () {
                expect(viewModel.canUnloadSettings).toBeObservable();
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

        describe('settingsFrameLoaded:', function () {
            it('should be function', function () {
                expect(viewModel.settingsFrameLoaded).toBeFunction();
            });

            it('shoul set save state for template settings', function () {
                viewModel.canUnloadSettings(false);
                viewModel.settingsFrameLoaded();
                expect(viewModel.canUnloadSettings()).toBeTruthy();
            });

            it('should set settingsLoadingTimeoutId', function () {
                viewModel.settingsLoadingTimeoutId = null;
                viewModel.settingsFrameLoaded();
                expect(viewModel.settingsLoadingTimeoutId).not.toBeNull();
            });

            it('should show settings after timeout', function () {
                jasmine.clock().install();
                viewModel.settingsVisibility(false);

                viewModel.settingsFrameLoaded();
                jasmine.clock().tick(2100);

                expect(viewModel.settingsVisibility()).toBeTruthy();
                jasmine.clock().uninstall();
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
