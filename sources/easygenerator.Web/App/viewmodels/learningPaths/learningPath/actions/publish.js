define(['knockout', 'notify', 'eventTracker', 'clientContext', 'constants', 'plugins/router'], function (ko, notify, eventTracker, clientContext, constants, router) {

    var
       events = {
           publishLearningPath: 'Publish learning path',
           copyEmbedCode: 'Copy embed code',
           copyPublishLink: 'Copy publish link'
       };

    var ctor = function () {
        var viewModel = {
            learningPath: null,

            publishLink: ko.observable(''),
            isPublishing: ko.observable(false),
            linkCopied: ko.observable(false),
            embedCodeCopied: ko.observable(false),
            copyDisabled: ko.observable(false),
            publishAvailable: ko.observable(true),

            onCopyLink: onCopyLink,
            onCopyEmbedCode: onCopyEmbedCode,
            openPublishLink: openPublishLink,
            validateFrameHeight: validateFrameHeight,
            validateFrameWidth: validateFrameWidth,

            publish: publish,
            activate: activate
        }

        viewModel.frameWidth = ko.observable(_.isNullOrUndefined(clientContext.get(constants.frameSize.width.name)) ? constants.frameSize.width.value : clientContext.get(constants.frameSize.width.name));
        viewModel.frameHeight = ko.observable(_.isNullOrUndefined(clientContext.get(constants.frameSize.height.name)) ? constants.frameSize.height.value : clientContext.get(constants.frameSize.height.name));

        viewModel.embedCode = ko.computed(function () {
            clientContext.set(constants.frameSize.width.name, viewModel.frameWidth());
            clientContext.set(constants.frameSize.height.name, viewModel.frameHeight());
            return constants.embedCode.replace('{W}', viewModel.frameWidth())
                                      .replace('{H}', viewModel.frameHeight())
                                      .replace('{src}', viewModel.publishLink());
        });

        return viewModel;

        function onCopyLink() {
            eventTracker.publish(events.copyPublishLink, viewModel.eventCategory);
            updateCopiedValue(viewModel.linkCopied);
        }

        function onCopyEmbedCode() {
            eventTracker.publish(events.copyEmbedCode, viewModel.eventCategory);
            updateCopiedValue(viewModel.embedCodeCopied);
        }

        function updateCopiedValue(value) {
            value(true);
            _.delay(function () {
                value(false);
            }, constants.copyToClipboardWait);
        }

        function openPublishLink() {
            if (viewModel.publishLink()) {
                router.openUrl(viewModel.publishLink());
            }
        }

        function validateFrameWidth() {
            if (!viewModel.frameWidth() || viewModel.frameWidth() == 0) {
                viewModel.frameWidth(constants.frameSize.width.value);
            }
        }

        function validateFrameHeight() {
            if (!viewModel.frameHeight() || viewModel.frameHeight() == 0) {
                viewModel.frameHeight(constants.frameSize.height.value);
            }
        }

        function publish() {
            if (viewModel.isPublishing()) {
                return;
            }

            viewModel.isPublishing(true);
            eventTracker.publish(events.publishLearningPath);

            return viewModel.learningPath.publish().then(function (publishLink) {
                viewModel.publishLink(publishLink);
            }).fail(function (message) {
                notify.error(message);
            }).fin(function () {
                viewModel.isPublishing(false);
            });
        }

        function activate(learningPath) {
            viewModel.learningPath = learningPath;
            viewModel.publishLink(learningPath.publishLink);
            viewModel.isPublishing(learningPath.isPublishing);
        }
    };

    return ctor;
});