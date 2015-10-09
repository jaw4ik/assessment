define(['eventTracker', 'constants'],
    function (eventTracker, constants) {

        "use strict";
        var eventCategory = 'Video library',
            events = {
                openVideoPopup: 'Open video preview',
                copyVideoEmbedCode: 'Copy video embed code'
            };

        var videoConstants = constants.storage;

        var viewModel = {

            videoIframe: ko.observable(),
            embedCode: ko.observable(),
            enableVideo: ko.observable(),

            isShown: ko.observable(false),

            copyBtnDisabled: ko.observable(false),
            embedCodeCopied: ko.observable(false),
            copyEmbedCode: copyEmbedCode,
            copyEmbedCodeEvent: copyEmbedCodeEvent,

            show: show,
            hide: hide
        };

        return viewModel;

        function show(video) {
            viewModel.enableVideo(video.enableVideo);
            eventTracker.publish(events.openVideoPopup, eventCategory);

            viewModel.videoIframe(viewModel.enableVideo() ? buildVideoIframe(video.vimeoId) : buildAudioIframe(video.vimeoId));
            viewModel.embedCode(viewModel.enableVideo() ? buildVideoIframe(video.vimeoId) : buildAudioEmbedCode(video.vimeoId));

            viewModel.copyBtnDisabled(false);
            viewModel.embedCodeCopied(false);

            viewModel.isShown(true);
        }

        function hide() {
            viewModel.isShown(false);
            viewModel.videoIframe(null);
        }

        function buildVideoIframe(vimeoId) {
            var iframe = '<iframe src="' + constants.player.host + '?source=' + vimeoId + '&video=1' + '&fullscreen_toggle=1"' +
                ' width="' + videoConstants.video.iframeWidth +
                '" height="' + videoConstants.video.iframeHeight +
                '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen ></iframe>';
            return iframe;
        }

        function buildAudioIframe(vimeoId) {
            var iframe = '<iframe src="' + constants.player.host + '?source=' + vimeoId + '&background=1"' +
               ' width="' + videoConstants.audio.iframeWidth +
               '" height="' + videoConstants.audio.iframeHeight +
               '" frameborder="0"></iframe>';
            return iframe;
        }

        function buildAudioEmbedCode(vimeoId) {
            var iframe = '<iframe src="' + constants.player.host + '?source=' + vimeoId + '"' +
               ' width="' + videoConstants.audio.embedIframeWidth +
               '" height="' + videoConstants.audio.embedIframeHeight +
               '" frameborder="0"></iframe>';
            return iframe;
        }

        function copyEmbedCodeEvent() {
            eventTracker.publish(events.copyVideoEmbedCode, eventCategory);
        }

        function copyEmbedCode() {
            copyToClipboard(viewModel.embedCodeCopied);
        }

        function copyToClipboard(value) {
            value(true);
            setTimeout(function () {
                value(false);
            }, constants.copyToClipboardWait);
        }
    });