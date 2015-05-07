define(['eventTracker', 'constants'],
    function (eventTracker, constants) {

        "use strict";

        var events = {
            openVideoPopup: 'Open video popup',
            getVideoEmbedCode: 'Get video embed code'
        };

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

        function show(videoIframe) {
            eventTracker.publish(events.openVideoPopup);

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

        function copyEmbedCode() {
            eventTracker.publish(events.getVideoEmbedCode);

            copyToClipboard(viewModel.embedCodeCopied);
        }

        function copyToClipboard(value) {
            value(true);
            _.delay(function () {
                value(false);
            }, constants.copyToClipboardWait);
        }
    });