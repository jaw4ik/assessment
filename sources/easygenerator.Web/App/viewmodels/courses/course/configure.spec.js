﻿import viewModel from './configure';

import router from 'plugins/router';
import eventTracker from 'eventTracker';
import notify from 'notify';
import courseRepository from 'repositories/courseRepository';
import templateRepository from 'repositories/templateRepository';
import waiter from 'utils/waiter';
import app from 'durandal/app';
import constants from 'constants';

describe('viewModel [configure]', function () {

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

    describe('templateId:', function () {
        it('should be observable', function () {
            expect(viewModel.templateId).toBeObservable();
        });
    });

    describe('settingsAvailable:', function () {
        it('should be observable', function () {
            expect(viewModel.settingsAvailable).toBeObservable();
        });
    });

    describe('configureSettingsUrl:', function () {
        it('should be observable', function () {
            expect(viewModel.configureSettingsUrl).toBeObservable();
        });
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
            spyOn(notify, 'error');
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
                    expect(notify.error).toHaveBeenCalled();
                    done();
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
                template = { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], description: "Default template", previewDemoUrl: 'preview_url_default', settingsUrls: { design: null, configure: null }, isLoading: ko.observable(false) },
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

            it('should set template id', function (done) {
                viewModel.templateId(null);

                viewModel.activate(course.id).fin(function () {
                    expect(viewModel.templateId()).toBe(course.template.id);
                    done();
                });
            });

            it('should set configureSettingsUrl', function (done) {
                viewModel.configureSettingsUrl(null);

                viewModel.activate(course.id).fin(function () {
                    expect(viewModel.configureSettingsUrl()).toBe(course.template.settingsUrls.configure);
                    done();
                });
            });

            describe('and when settingsUrls.configure does not exist', function () {
                beforeEach(function () {
                    course.template.settingsUrls.configure = null;
                });

                it('should set settingsAvailable to false', function (done) {
                    viewModel.settingsAvailable(true);

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.settingsAvailable()).toBeFalsy();
                        done();
                    });
                });
            });

            describe('and when settingsUrls.configure exists', function () {

                beforeEach(function () {
                    course.template.settingsUrls.configure = 'some/url';
                });

                it('should set settingsAvailable to true', function (done) {
                    viewModel.settingsAvailable(false);

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.settingsAvailable()).toBeTruthy();
                        done();
                    });
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
            viewModel.courseId = 'id';
            viewModel.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.course.templateUpdated + viewModel.courseId, viewModel.templateUpdated);
        });

        it('should unsubscribe from templateUpdatedByCollaborator event', function () {
            viewModel.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.course.templateUpdatedByCollaborator, viewModel.templateUpdatedByCollaborator);
        });
    });

    describe('courseId:', function () {

        it('should be defined', function () {
            expect(viewModel.courseId).toBeDefined();
        });

    });

    describe('canUnloadSettings:', function () {

        it('should be observable', function () {
            expect(viewModel.canUnloadSettings).toBeObservable();
        });

    });

    describe('frameLoaded:', function () {

        it('should be function', function () {
            expect(viewModel.frameLoaded).toBeFunction();
        });

        it('shoul set save state for template settings', function () {
            viewModel.canUnloadSettings(false);
            viewModel.frameLoaded();
            expect(viewModel.canUnloadSettings()).toBeTruthy();
        });

        it('should set settingsLoadingTimeoutId', function () {
            viewModel.settingsLoadingTimeoutId = null;
            viewModel.frameLoaded();
            expect(viewModel.settingsLoadingTimeoutId).not.toBeNull();
        });

        it('should show settings after timeout', function () {
            jasmine.clock().install();
            viewModel.settingsVisibility(false);

            viewModel.frameLoaded();
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


    describe('templateUpdated:', function () {
        var template = { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], description: "Default template", previewDemoUrl: 'preview_url_default', settingsUrls: { design: null, configure: null }, isLoading: ko.observable(false) };

        describe('when template id is not equal to current template id', function () {
            beforeEach(function () {
                viewModel.templateId('');
            });

            it('should set template id', function () {
                viewModel.templateId('');
                viewModel.templateUpdated(template);
                expect(viewModel.templateId()).toBe(template.id);
            });

            it('should set configureSettingsUrl', function () {
                viewModel.configureSettingsUrl(null);
                viewModel.templateUpdated(template);
                expect(viewModel.configureSettingsUrl()).toBe(template.settingsUrls.configure);
            });

            describe('and when settingsUrls.configure does not exist', function () {
                beforeEach(function () {
                    template.settingsUrls.configure = null;
                });
                it('should set settingsAvailable to false', function () {
                    viewModel.settingsAvailable(true);
                    viewModel.templateUpdated(template);
                    expect(viewModel.settingsAvailable()).toBeFalsy();
                });
            });

            describe('and when settingsUrls.configure exists', function () {
                beforeEach(function () {
                    template.settingsUrls.configure = 'some/url';
                });

                it('should set settingsAvailable to true', function () {
                    viewModel.settingsAvailable(false);
                    viewModel.templateUpdated(template);
                    expect(viewModel.settingsAvailable()).toBeTruthy();
                });
            });
        });

        describe('when template id equals to current template id', function () {
            beforeEach(function () {
                viewModel.templateId(template.id);
            });

            it('should not change template id', function () {
                viewModel.templateId('');
                viewModel.templateUpdated(template);
                expect(viewModel.templateId()).toBe(template.id);
            });

            it('should not change configureSettingsUrl', function () {
                viewModel.configureSettingsUrl(null);
                viewModel.templateUpdated(template);
                expect(viewModel.configureSettingsUrl()).toBe(null);
            });

            describe('and when settingsUrls.configure does not exist', function () {
                beforeEach(function () {
                    template.settingsUrls.configure = null;
                });
                it('should not change settingsAvailable', function () {
                    viewModel.settingsAvailable(true);
                    viewModel.templateUpdated(template);
                    expect(viewModel.settingsAvailable()).toBeTruthy();
                });
            });

            describe('and when settingsUrls.configure exists', function () {
                beforeEach(function () {
                    template.settingsUrls.configure = 'some/url';
                });

                it('should not change settingsAvailable', function () {
                    viewModel.settingsAvailable(false);
                    viewModel.templateUpdated(template);
                    expect(viewModel.settingsAvailable()).toBeFalsy();
                });
            });
        });
    });

    describe('templateUpdatedByCollaborator:', function () {
        var template = { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], description: "Default template", previewDemoUrl: 'preview_url_default', settingsUrls: { design: null, configure: null }, order: 1, isNew: true, isCustom: true, loadingTemplate: ko.observable(false) },
        course = {
            id: 'id',
            title: 'title',
            createdBy: 'createdBy',
            isDirty: true,
            template: template
        };

        describe('when course is current course', function () {
            beforeEach(function () {
                viewModel.id = course.id;
            });

            describe('when template id is not equal to current template id', function () {
                beforeEach(function () {
                    viewModel.templateId('');
                });

                it('should set template id', function () {
                    viewModel.templateId('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.templateId()).toBe(template.id);
                });

                it('should set configureSettingsUrl', function () {
                    viewModel.configureSettingsUrl(null);
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.configureSettingsUrl()).toBe(template.settingsUrls.configure);
                });

                describe('and when settingsUrls.configure does not exist', function () {
                    beforeEach(function () {
                        template.settingsUrls.configure = null;
                    });
                    it('should set settingsAvailable to false', function () {
                        viewModel.settingsAvailable(true);
                        viewModel.templateUpdatedByCollaborator(course);
                        expect(viewModel.settingsAvailable()).toBeFalsy();
                    });
                });

                describe('and when settingsUrls.configure exists', function () {
                    beforeEach(function () {
                        template.settingsUrls.configure = 'some/url';
                    });

                    it('should set settingsAvailable to true', function () {
                        viewModel.settingsAvailable(false);
                        viewModel.templateUpdatedByCollaborator(course);
                        expect(viewModel.settingsAvailable()).toBeTruthy();
                    });
                });
            });

            describe('when template id equals to current template id', function () {
                beforeEach(function () {
                    viewModel.templateId(template.id);
                });

                it('should not change template id', function () {
                    viewModel.templateId('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.templateId()).toBe(template.id);
                });

                it('should not change configureSettingsUrl', function () {
                    viewModel.configureSettingsUrl(null);
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.configureSettingsUrl()).toBe(null);
                });

                describe('and when settingsUrls.configure does not exist', function () {
                    beforeEach(function () {
                        template.settingsUrls.configure = null;
                    });
                    it('should not change settingsAvailable', function () {
                        viewModel.settingsAvailable(true);
                        viewModel.templateUpdatedByCollaborator(course);
                        expect(viewModel.settingsAvailable()).toBeTruthy();
                    });
                });

                describe('and when settingsUrls.configure exists', function () {
                    beforeEach(function () {
                        template.settingsUrls.configure = 'some/url';
                    });

                    it('should not change settingsAvailable', function () {
                        viewModel.settingsAvailable(false);
                        viewModel.templateUpdatedByCollaborator(course);
                        expect(viewModel.settingsAvailable()).toBeFalsy();
                    });
                });
            });
        });

        describe('when course is not current course', function () {
            beforeEach(function () {
                viewModel.courseId = 'some id';
            });

            describe('and when template id is not equal to current template id', function () {
                beforeEach(function () {
                    viewModel.templateId('');
                });

                it('should not change template id', function () {
                    viewModel.templateId('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.templateId()).toBe('');
                });

                it('should not change configureSettingsUrl', function () {
                    viewModel.configureSettingsUrl(null);
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.configureSettingsUrl()).toBe(null);
                });

                describe('and when settingsUrls.configure does not exist', function () {
                    beforeEach(function () {
                        template.settingsUrls.configure = null;
                    });
                    it('should not change settingsAvailable', function () {
                        viewModel.settingsAvailable(true);
                        viewModel.templateUpdatedByCollaborator(course);
                        expect(viewModel.settingsAvailable()).toBeTruthy();
                    });
                });

                describe('and when settingsUrls.configure exists', function () {
                    beforeEach(function () {
                        template.settingsUrls.configure = 'some/url';
                    });

                    it('should not change settingsAvailable', function () {
                        viewModel.settingsAvailable(false);
                        viewModel.templateUpdatedByCollaborator(course);
                        expect(viewModel.settingsAvailable()).toBeFalsy();
                    });
                });
            });

            describe('and when template id equals to current template id', function () {
                beforeEach(function () {
                    viewModel.templateId(template.id);
                });

                it('should not change template id', function () {
                    viewModel.templateId('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.templateId()).toBe('');
                });

                it('should not change configureSettingsUrl', function () {
                    viewModel.configureSettingsUrl(null);
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.configureSettingsUrl()).toBe(null);
                });

                describe('and when settingsUrls.configure does not exist', function () {
                    beforeEach(function () {
                        template.settingsUrls.configure = null;
                    });
                    it('should not change settingsAvailable', function () {
                        viewModel.settingsAvailable(true);
                        viewModel.templateUpdatedByCollaborator(course);
                        expect(viewModel.settingsAvailable()).toBeTruthy();
                    });
                });

                describe('and when settingsUrls.configure exists', function () {
                    beforeEach(function () {
                        template.settingsUrls.configure = 'some/url';
                    });

                    it('should not change settingsAvailable', function () {
                        viewModel.settingsAvailable(false);
                        viewModel.templateUpdatedByCollaborator(course);
                        expect(viewModel.settingsAvailable()).toBeFalsy();
                    });
                });
            });
        });
    });
});
