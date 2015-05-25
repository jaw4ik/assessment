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

            isShown: ko.observable(false),

            copyBtnDisabled: ko.observable(false),
            embedCodeCopied: ko.observable(false),
            copyEmbedCode: copyEmbedCode,

            show: show,
            hide: hide
        };

        return viewModel;

        function show(vimeoId) {
            var videoIframe = buildIframe(vimeoId);

            eventTracker.publish(events.openVideoPopup, eventCategory);

            viewModel.videoIframe(videoIframe);
            viewModel.embedCode(videoIframe);

            viewModel.copyBtnDisabled(false);
            viewModel.embedCodeCopied(false);

            viewModel.isShown(true);
        }

        function hide() {

            viewModel.isShown(false);
            viewModel.videoIframe(null);
        }

        function buildIframe(vimeoId) {
            return '<iframe src="' + videoConstants.host + videoConstants.video.videoUrl + '/' + vimeoId + '?color=ffffff&title=0&byline=0&portrait=0"' +
                ' width="' + videoConstants.video.iframeWidth +
                '" height="' + videoConstants.video.iframeHeight +
                '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        }

        function copyEmbedCode() {
            eventTracker.publish(events.copyVideoEmbedCode, eventCategory);

            copyToClipboard(viewModel.embedCodeCopied);
        }

        function copyToClipboard(value) {
            value(true);
            _.delay(function () {
                value(false);
            }, constants.copyToClipboardWait);
        }
    });