import viewModel from 'dialogs/video/video';

import eventTracker from 'eventTracker';
import constants from 'constants';
let videoConstants = constants.storage;

describe('dialog [video]', function () {
    var version = constants.appVersion;

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

    describe('enableVideo:', function () {
        it('should be observable', function () {
            expect(viewModel.enableVideo).toBeObservable();
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
            jasmine.clock().uninstall();
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

        describe('when show audio popup', function() {
            var video = { vimeoId: 'videoId' };

            it('should set enableVideo to false', function() {
                viewModel.enableVideo(true);
                viewModel.show(video);
                expect(viewModel.enableVideo()).toBeFalsy();
            });

            it('should set specific videoIframe', function() {
                var iframe = '<iframe src="' + constants.player.host + '?source=' + video.vimeoId + '&background=1&autoplay=1&v=' + version + '" width="' + videoConstants.audio.iframeWidth + '" height="' + videoConstants.audio.iframeHeight + '" frameborder="0" ' + ' ></iframe>';
                viewModel.videoIframe('');
                viewModel.show(video);
                expect(viewModel.videoIframe()).toBe(iframe);
            });

            it('should set specific embed code', function () {
                var iframe = '<iframe src="' + constants.player.host + '?source=' + video.vimeoId + '&v=' + version + '" width="' + videoConstants.audio.embedIframeWidth + '" height="' + videoConstants.audio.embedIframeHeight + '" frameborder="0" ' + ' ></iframe>';
                viewModel.embedCode('');
                viewModel.show(video);
                expect(viewModel.embedCode()).toBe(iframe);
            });

        });

        describe('when show video popup', function () {
            var video = { vimeoId: 'videoId', enableVideo: true };

            it('should set enableVideo to true', function () {
                viewModel.enableVideo(false);
                viewModel.show(video);
                expect(viewModel.enableVideo()).toBeTruthy();
            });

            it('should set specific videoIframe', function () {
                var iframe = '<iframe src="' + constants.player.host + '?source=' + video.vimeoId + '&video=1&fullscreen_toggle=1&autoplay=1&v=' + version + '" width="' + videoConstants.video.iframeWidth + '" height="' + videoConstants.video.iframeHeight + '" frameborder="0" ' + 'webkitallowfullscreen mozallowfullscreen allowfullscreen' + ' ></iframe>';
                viewModel.videoIframe('');
                viewModel.show(video);
                expect(viewModel.videoIframe()).toBe(iframe);
            });

            it('should set specific embed code', function () {
                var iframe = '<iframe src="' + constants.player.host + '?source=' + video.vimeoId + '&video=1&fullscreen_toggle=1&v=' + version + '" width="' + videoConstants.video.iframeWidth + '" height="' + videoConstants.video.iframeHeight + '" frameborder="0" ' + 'webkitallowfullscreen mozallowfullscreen allowfullscreen' + ' ></iframe>';
                viewModel.embedCode('');
                viewModel.show(video);
                expect(viewModel.embedCode()).toBe(iframe);
            });

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
