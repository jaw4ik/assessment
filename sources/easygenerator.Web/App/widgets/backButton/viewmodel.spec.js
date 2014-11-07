define(['widgets/backButton/viewmodel'], function (viewmodel) {
    "use strict";

    var
        app = require('durandal/app'),
        router = require('plugins/router'),
        constants = require('constants'),
        BackButton = require('models/backButton'),
        localizationManager = require('localization/localizationManager');

    describe('widget [backButton]', function () {

        var backButton = new viewmodel();

        describe('enabled:', function () {

            it('should be observable', function () {
                expect(backButton.enabled).toBeObservable();
            });

            it('should be false by default', function () {
                expect(backButton.enabled()).toBeFalsy();
            });

        });

        describe('visible:', function () {

            it('should be observable', function () {
                expect(backButton.visible).toBeObservable();
            });

        });

        describe('url:', function () {

            it('should be observable', function () {
                expect(backButton.url).toBeObservable();
            });

            it('should be null by default', function () {
                expect(backButton.url()).toBeNull();
            });

        });

        describe('tooltip:', function () {

            it('should be observable', function () {
                expect(backButton.tooltip).toBeObservable();
            });

            it('should be null by default', function () {
                expect(backButton.tooltip()).toBeNull();
            });

        });

        describe('action:', function () {

            it('should be defined', function () {
                expect(backButton.action).toBeDefined();
            });

            it('should be null by default', function () {
                expect(backButton.action).toBeNull();
            });

        });

        describe('show:', function () {

            it('should be function', function () {
                expect(backButton.show).toBeFunction();
            });

            it('should set visible to true', function () {
                backButton.visible(false);
                backButton.show();
                expect(backButton.visible()).toBeTruthy();
            });

        });

        describe('hide:', function () {

            it('should be function', function () {
                expect(backButton.hide).toBeFunction();
            });

            it('should set visible to false', function () {
                backButton.visible(true);
                backButton.hide();
                expect(backButton.visible()).toBeFalsy();
            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(backButton.activate).toBeFunction();
            });

            beforeEach(function () {
                spyOn(router, 'activeItem').and.returnValue({ backButtonData: {} });
            });

            it('should update back button with router active item', function () {
                spyOn(backButton, 'update');
                backButton.activate();
                expect(backButton.update).toHaveBeenCalledWith(router.activeItem());
            });

            it('should subscribe to router \'router:navigation:complete\' event', function () {
                spyOn(router, 'on');
                backButton.activate();
                expect(router.on).toHaveBeenCalledWith('router:navigation:complete', backButton.update);
            });

            it('should subscribe to app ' + constants.messages.treeOfContent.expanded + ' event', function () {
                spyOn(app, 'on');
                backButton.activate();
                expect(app.on).toHaveBeenCalledWith(constants.messages.treeOfContent.expanded, backButton.hide);
            });

            it('should subscribe to app ' + constants.messages.treeOfContent.collapsed + ' event', function () {
                spyOn(app, 'on');
                backButton.activate();
                expect(app.on).toHaveBeenCalledWith(constants.messages.treeOfContent.collapsed, backButton.show);
            });

        });

        describe('update:', function () {

            it('should be function', function () {
                expect(backButton.update).toBeFunction();
            });

            describe('when viewmodel parameter equals null or undefined', function () {

                it('should not throw error', function () {
                    expect(function () { backButton.update(null); }).not.toThrow();
                });

            });

            var viewdata = {};
            describe('when backButtonData not instance of BackButton', function () {

                beforeEach(function () {
                    viewdata.backButtonData = null;
                });

                it('should set enabled to false', function () {
                    backButton.enabled(true);
                    backButton.update(viewdata);
                    expect(backButton.enabled()).toBeFalsy();
                });

            });

            describe('when backButtonData is instance of BackButton', function () {

                beforeEach(function () {
                    viewdata.backButtonData = new BackButton({
                        url: 'some/url',
                        backViewName: 'some_view',
                        callback: function () { }
                    });
                    spyOn(router, 'navigateWithQueryString').and.callFake(function () { });
                });

                it('should set url', function () {
                    backButton.url('');
                    backButton.update(viewdata);
                    expect(backButton.url()).toBe('#' + viewdata.backButtonData.url);
                });

                it('should set tooltip', function () {
                    backButton.tooltip('');
                    backButton.update(viewdata);
                    expect(backButton.tooltip()).toBe(localizationManager.localize('backTo') + ' ' + viewdata.backButtonData.backViewName);
                });

                it('should set action', function () {
                    backButton.action = null;
                    backButton.update(viewdata);
                    expect(backButton.action).toBeFunction();
                });

                it('should call callback function in action', function () {
                    spyOn(viewdata.backButtonData, 'callback');
                    backButton.action = null;
                    backButton.update(viewdata);
                    backButton.action();
                    expect(viewdata.backButtonData.callback).toHaveBeenCalled();
                });

                it('should redirect to url', function () {
                    backButton.update(viewdata);
                    backButton.action();
                    expect(router.navigateWithQueryString).toHaveBeenCalledWith(viewdata.backButtonData.url);
                });

                it('should set enabled to true', function () {
                    backButton.enabled(false);
                    backButton.update(viewdata);
                    expect(backButton.enabled()).toBeTruthy();
                });

                describe('and when back button should always visible', function() {
                    
                    beforeEach(function () {
                        viewdata.backButtonData.configure({
                            alwaysVisible: true
                        });
                    });

                    it('should set visible to false', function () {
                        backButton.visible(false);
                        backButton.update(viewdata);
                        expect(backButton.visible()).toBeTruthy();
                    });

                });

            });

        });

    });

});