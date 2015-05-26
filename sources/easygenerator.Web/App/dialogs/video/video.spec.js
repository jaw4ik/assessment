define(['dialogs/video/video'], function (viewModel) {

    "use strict";

    var eventTracker = require('eventTracker'),
        constants = require('constants'),
        videoConstants = constants.storage;
    ;

    describe('dialog [video]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('videoIframe:', function () {
            it('should be observable', function () {
                expect(viewModel.videoIframe).toBeObservable();
            });
        });

        describe('embedCode:', function () {
            it('should be observable', function () {
                expect(viewModel.embedCode).toBeObservable();
            });
        });

        describe('isShown:', function () {
            it('should be observable', function () {
                expect(viewModel.isShown).toBeObservable();
            });
        });

        describe('copyBtnDisabled:', function () {
            it('should be observable', function () {
                expect(viewModel.copyBtnDisabled).toBeObservable();
            });
        });

        describe('embedCodeCopied:', function () {
            it('should be observable', function () {
                expect(viewModel.embedCodeCopied).toBeObservable();
            });
        });

        describe('copyEmbedCode:', function () {
            it('should be function', function () {
                expect(viewModel.copyEmbedCode).toBeFunction();
            });

            it('should set embedCodeCopied to true', function () {
                viewModel.embedCodeCopied(false);
                viewModel.copyEmbedCode();
                expect(viewModel.embedCodeCopied()).toBeTruthy();
            });

            it('should set embedCodeCopied to false after timeout', function () {
                jasmine.clock().install();
                viewModel.embedCodeCopied(true);
                viewModel.copyEmbedCode();
                jasmine.clock().tick(constants.copyToClipboardWait + 100);
                expect(viewModel.embedCodeCopied()).toBeFalsy();
            });
        });

        describe('copyEmbedCodeEvent', function() {
            it('should be function', function () {
                expect(viewModel.copyEmbedCodeEvent).toBeFunction();
            });

            it('should publish event', function () {
                viewModel.copyEmbedCodeEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Copy video embed code', 'Video library');
            });
        });

        describe('show:', function () {
            var vimeoId = 'vimeoId';

            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            it('should set isShown to true', function () {
                viewModel.isShown(false);
                viewModel.show(vimeoId);
                expect(viewModel.isShown()).toBeTruthy();
            });

            it('should publish event', function () {
                viewModel.show(vimeoId);
                expect(eventTracker.publish).toHaveBeenCalledWith('Open video preview', 'Video library');
            });

            it('should set videoIframe', function () {
                viewModel.show(vimeoId);
                expect(viewModel.videoIframe()).toBe('<iframe src="' + videoConstants.host + videoConstants.video.videoUrl + '/' + vimeoId + '?color=ffffff&title=0&byline=0&portrait=0"' +
                ' width="' + videoConstants.video.iframeWidth +
                '" height="' + videoConstants.video.iframeHeight +
                '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
            });

            it('should set embedCode', function () {
                viewModel.show(vimeoId);
                expect(viewModel.embedCode()).toBe('<iframe src="' + videoConstants.host + videoConstants.video.videoUrl + '/' + vimeoId + '?color=ffffff&title=0&byline=0&portrait=0"' +
                ' width="' + videoConstants.video.iframeWidth +
                '" height="' + videoConstants.video.iframeHeight +
                '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
            });

            it('should set copyBtnDisabled to false', function () {
                viewModel.copyBtnDisabled(true);
                viewModel.show(vimeoId);
                expect(viewModel.copyBtnDisabled()).toBeFalsy();
            });

            it('should set embedCodeCopied to false', function () {
                viewModel.embedCodeCopied(true);
                viewModel.show(vimeoId);
                expect(viewModel.embedCodeCopied()).toBeFalsy();
            });

        });

        describe('hide:', function () {

            it('should be function', function () {
                expect(viewModel.hide).toBeFunction();
            });

            it('should set isShown to false', function () {
                viewModel.isShown(true);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
            });

            it('should set videoIframe to null', function () {
                viewModel.videoIframe('videoIframe');
                viewModel.hide();
                expect(viewModel.videoIframe()).toBeNull();
            });
        });

    });

});