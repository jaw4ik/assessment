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

        function buildIframe(vimeoId, options, width, height, allowFullscreen) {
            var fullscreenCode = "";
            if (allowFullscreen) {
                fullscreenCode = "webkitallowfullscreen mozallowfullscreen allowfullscreen";
            }
            var iframe = '<iframe src="' + constants.player.host + '?source=' + vimeoId + options + '&v=' + constants.appVersion + '"' +
               ' width="' + width +
               '" height="' + height +
               '" frameborder="0" ' + fullscreenCode + ' ></iframe>';
            return iframe;
        }

        function buildVideoIframe(vimeoId) {
            return buildIframe(vimeoId, '&video=1&fullscreen_toggle=1', videoConstants.video.iframeWidth, videoConstants.video.iframeHeight, true);
        }

        function buildAudioIframe(vimeoId) {
            return buildIframe(vimeoId, '&background=1', videoConstants.audio.iframeWidth, videoConstants.audio.iframeHeight, false);
        }

        function buildAudioEmbedCode(vimeoId) {
            return buildIframe(vimeoId, '', videoConstants.audio.embedIframeWidth, videoConstants.audio.embedIframeHeight, false);
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