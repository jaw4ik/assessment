define(['viewmodels/learningPaths/learningPath/actions/publish'], function(publishAction) {
    'use strict';
    var
        viewModel,
        notify = require('notify'),
        eventTracker = require('eventTracker'),
        clientContext = require('clientContext'),
        constants = require('constants'),
        router = require('plugins/router');

    describe('viewModel [learningPath publish]', function() {

        beforeEach(function () {
            viewModel = publishAction();
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'error');
            spyOn(router, 'openUrl');
        });

        describe('learningPath:', function() {
            it('should be defined', function() {
                expect(viewModel.learningPath).toBeDefined();
            });
        });

        describe('publishLink:', function() {
            it('should be observable', function() {
                expect(viewModel.publishLink).toBeObservable();
            });
        });

        describe('isPublishing:', function () {
            it('should be observable', function () {
                expect(viewModel.isPublishing).toBeObservable();
            });
        });

        describe('linkCopied:', function() {
            it('should be observable', function() {
                expect(viewModel.linkCopied).toBeObservable();
            });
        });

        describe('embedCodeCopied:', function() {
            it('should be observable', function() {
                expect(viewModel.embedCodeCopied).toBeObservable();
            });
        });

        describe('copyDisabled:', function() {
            it('should be observable', function() {
                expect(viewModel.copyDisabled).toBeObservable();
            });
        });

        describe('publishAvailable:', function() {
            it('should be observable', function() {
                expect(viewModel.publishAvailable).toBeObservable();
            });
        });

        describe('frameWidth:', function () {

            it('should be observable', function () {
                expect(viewModel.frameWidth).toBeObservable();
            });

        });

        describe('frameHeight:', function () {

            it('should be observable', function () {
                expect(viewModel.frameHeight).toBeObservable();
            });

        });

        describe('embedCode:', function () {

            it('should be computed', function () {
                expect(viewModel.embedCode).toBeComputed();
            });

            it('should be equal embedCode', function () {
                viewModel.frameWidth(640);
                viewModel.frameHeight(480);
                viewModel.publishLink('publishLink');
                var embedCode = '<iframe width="640" height="480" src="publishLink" frameborder="0" allowfullscreen></iframe>';

                expect(viewModel.embedCode()).toBe(embedCode);
            });

        });

        describe('onCopyLink:', function() {

            it('should be function', function() {
                expect(viewModel.onCopyLink).toBeFunction();
            });

            it('should send event \'Copy publish link\'', function () {
                viewModel.eventCategory = 'category';
                viewModel.onCopyLink();
                expect(eventTracker.publish).toHaveBeenCalledWith('Copy publish link', 'category');
            });

        });

        describe('onCopyEmbedCode:', function() {
            
            it('should be function', function() {
                expect(viewModel.onCopyEmbedCode).toBeFunction();
            });

            it('should send event \'Copy embed code\'', function () {
                viewModel.eventCategory = 'category';
                viewModel.onCopyEmbedCode();
                expect(eventTracker.publish).toHaveBeenCalledWith('Copy embed code', 'category');
            });

        });

        describe('openPublishLink:', function() {

            it('should be function', function() {
                expect(viewModel.openPublishLink).toBeFunction();
            });

            describe('when publish link is empty', function() {
                it('should not open link', function() {
                    viewModel.publishLink('');
                    viewModel.openPublishLink();
                    expect(router.openUrl).not.toHaveBeenCalled();
                });
            });

            it('should open link', function() {
                viewModel.publishLink('publishLink');
                viewModel.openPublishLink();
                expect(router.openUrl).toHaveBeenCalledWith('publishLink');
            });

        });

        describe('validateFrameHeight:', function() {

            describe('when frame height is undefined', function () {
                it('should set default value', function () {
                    viewModel.frameHeight('');
                    viewModel.validateFrameHeight();
                    expect(viewModel.frameHeight()).toBe(constants.frameSize.height.value);
                });
            });

            describe('when frame height is 0', function() {
                it('should set default value', function() {
                    viewModel.frameHeight(0);
                    viewModel.validateFrameHeight();
                    expect(viewModel.frameHeight()).toBe(constants.frameSize.height.value);
                });
            });

            describe('when frame height is correct', function() {
                it('should not change value', function() {
                    viewModel.frameHeight(10);
                    viewModel.validateFrameHeight();
                    expect(viewModel.frameHeight()).toBe(10);
                });
            });

        });

        describe('validateFrameWidth:', function() {
            
            describe('when frame width is undefined', function () {
                it('should set default value', function () {
                    viewModel.frameWidth('');
                    viewModel.validateFrameWidth();
                    expect(viewModel.frameWidth()).toBe(constants.frameSize.width.value);
                });
            });

            describe('when frame width is 0', function () {
                it('should set default value', function () {
                    viewModel.frameWidth(0);
                    viewModel.validateFrameWidth();
                    expect(viewModel.frameWidth()).toBe(constants.frameSize.width.value);
                });
            });

            describe('when frame width is correct', function () {
                it('should not change value', function () {
                    viewModel.frameWidth(10);
                    viewModel.validateFrameWidth();
                    expect(viewModel.frameWidth()).toBe(10);
                });
            });

        });

        describe('publish:', function() {

            it('should be function', function() {
                expect(viewModel.publish).toBeFunction();
            });

        });

        describe('activate:', function() {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });
            
        });

    });
});