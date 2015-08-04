define(['viewmodels/courses/course/configure'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        notify = require('notify'),
        courseRepository = require('repositories/courseRepository'),
        templateRepository = require('repositories/templateRepository'),
        waiter = require('utils/waiter');

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
                    template = { id: "0", name: "Default", thumbnail: "path/to/image1.png", previewImages: ["path/to/previewImg.png"], description: "Default template", previewDemoUrl: 'preview_url_default', settingsUrls: { design: null, configure: null }, order: 1, isNew: true, isCustom: true, loadingTemplate: ko.observable(false) },
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

                it('should set currentTemplate', function (done) {
                    viewModel.currentTemplate = null;

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.currentTemplate).toBe(course.template);
                        done();
                    });
                });

                it('should set configureSettingsUrl', function (done) {
                    viewModel.configureSettingsUrl = null;

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.configureSettingsUrl).toBe(course.template.settingsUrls.configure);
                        done();
                    });
                });

                describe('and when settingsUrls.configure does not exist', function () {

                    beforeEach(function() {
                        course.template.settingsUrls.configure = null;
                    });

                    it('should set settingsAvailable to false', function (done) {
                        viewModel.settingsAvailable = true;

                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.settingsAvailable).toBeFalsy();
                            done();
                        });
                    });

                });

                describe('and when settingsUrls.configure exists', function() {
                    
                    beforeEach(function () {
                        course.template.settingsUrls.configure = 'some/url';
                    });

                    it('should set settingsAvailable to true', function (done) {
                        viewModel.settingsAvailable = false;

                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.settingsAvailable).toBeTruthy();
                            done();
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

            it('should be defined', function () {
                expect(viewModel.currentTemplate).toBeDefined();
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

    });

});
