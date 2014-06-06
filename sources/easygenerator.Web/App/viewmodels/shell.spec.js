define(['viewmodels/shell'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        dataContext = require('dataContext'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager')
    ;

    describe('viewModel [shell]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'setLocation');
            spyOn(notify, 'error');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('homeModule', function () {

            it('should be defined', function () {
                expect(viewModel.homeModuleName).toBeDefined();
            });

            it('should equal \'courses\'', function () {
                expect(viewModel.homeModuleName).toEqual('courses');
            });

        });

        describe('activate:', function () {

            var dataContextDefer;

            beforeEach(function () {
                dataContextDefer = Q.defer();
                spyOn(dataContext, 'initialize').and.returnValue(dataContextDefer.promise);
                dataContextDefer.resolve();
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            describe('when dataContext initialized', function () {

                var routerActivateDefer;

                beforeEach(function () {
                    routerActivateDefer = Q.defer();
                    spyOn(router, 'activate').and.returnValue(routerActivateDefer.promise);
                    routerActivateDefer.resolve();
                });
            });

        });

        describe('showNavigation:', function () {

            it('should be function', function () {
                expect(viewModel.showNavigation).toBeFunction();
            });

            describe('when activeModuleName is error page', function () {

                describe('and error page 404', function () {

                    it('should be return true', function () {
                        spyOn(viewModel, 'activeModuleName').and.returnValue('404');
                        expect(viewModel.showNavigation()).toBeTruthy();
                    });

                });

            });

            describe('when activeModuleName is not error page', function () {

                it('should be return fasle', function () {
                    spyOn(viewModel, 'activeModuleName').and.returnValue('somepage');
                    expect(viewModel.showNavigation()).toBeFalsy();
                });

            });

        });

        describe('courseDeleted:', function () {

            var courseId = 'courseId',
                errorMessage = 'error';

            beforeEach(function () {
                spyOn(localizationManager, 'localize').and.returnValue(errorMessage);
            });

            it('should be function', function () {
                expect(viewModel.courseDeleted).toBeFunction();
            });

            describe('when in context of course', function () {
                beforeEach(function () {
                    router.routeData({
                        courseId: courseId
                    });
                });

                it('should show notification error', function () {
                    viewModel.courseDeleted(courseId);
                    expect(notify.error).toHaveBeenCalledWith(errorMessage);
                });
            });

            describe('when not in context of course', function () {
                beforeEach(function () {
                    router.routeData({
                        courseId: 'id'
                    });
                });

                it('should not show notification error', function () {
                    viewModel.courseDeleted(courseId);
                    expect(notify.error).not.toHaveBeenCalledWith(errorMessage);
                });
            });

        });

    });

});