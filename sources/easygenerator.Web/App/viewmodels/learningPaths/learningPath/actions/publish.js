define(['knockout', 'notify', 'eventTracker', 'clientContext', 'constants', 'plugins/router', 'durandal/app'], function (ko, notify, eventTracker, clientContext, constants, router, app) {

    var
       events = {
           publishLearningPath: 'Publish learning path',
           copyEmbedCode: 'Copy embed code',
           copyPublishLink: 'Copy publish link'
       };

    var ctor = function () {
        var viewModel = {
            learningPath: null,
            companyInfo: null,

            publicationUrl: ko.observable(''),
            isPublishing: ko.observable(false),
            isDelivering: ko.observable(false),

            linkCopied: ko.observable(false),
            embedCodeCopied: ko.observable(false),
            copyDisabled: ko.observable(false),
            publishAvailable: ko.observable(true),

            onCopyLink: onCopyLink,
            onCopyEmbedCode: onCopyEmbedCode,
            openPublicationUrl: openPublicationUrl,
            validateFrameHeight: validateFrameHeight,
            validateFrameWidth: validateFrameWidth,

            publish: publish,
            onDeliveringStarted: onDeliveringStarted,
            onDeliveringFinished: onDeliveringFinished,

            activate: activate,
            deactivate: deactivate
        }

        viewModel.frameWidth = ko.observable(_.isNullOrUndefined(clientContext.get(constants.frameSize.width.name)) ? constants.frameSize.width.value : clientContext.get(constants.frameSize.width.name));
        viewModel.frameHeight = ko.observable(_.isNullOrUndefined(clientContext.get(constants.frameSize.height.name)) ? constants.frameSize.height.value : clientContext.get(constants.frameSize.height.name));

        viewModel.embedCode = ko.computed(function () {
            clientContext.set(constants.frameSize.width.name, viewModel.frameWidth());
            clientContext.set(constants.frameSize.height.name, viewModel.frameHeight());
            return constants.embedCode.replace('{W}', viewModel.frameWidth())
                                      .replace('{H}', viewModel.frameHeight())
                                      .replace('{src}', viewModel.publicationUrl());
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

        function openPublicationUrl() {
            if (viewModel.publicationUrl()) {
                router.openUrl(viewModel.publicationUrl());
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
            if (viewModel.isPublishing() || viewModel.isDelivering()) {
                return;
            }

            viewModel.isPublishing(true);
            eventTracker.publish(events.publishLearningPath);

            return viewModel.learningPath.publish()
                .then(function (publicationUrl) {
                    viewModel.publicationUrl(publicationUrl);
                })
                .fail(function (message) {
                    notify.error(message);
                })
                .fin(function () {
                    viewModel.isPublishing(false);
                });
        }

        function activate(learningPath) {
            viewModel.learningPath = learningPath;
            viewModel.publicationUrl(learningPath.publicationUrl);
            viewModel.isPublishing(learningPath.isPublishing);
            viewModel.isDelivering(learningPath.isDelivering());

            app.on(constants.messages.learningPath.delivering.started + viewModel.learningPath.id, viewModel.onDeliveringStarted);
            app.on(constants.messages.learningPath.delivering.finished + viewModel.learningPath.id, viewModel.onDeliveringFinished);
        }

        function deactivate() {
            app.off(constants.messages.learningPath.delivering.started + viewModel.learningPath.id, viewModel.onDeliveringStarted);
            app.off(constants.messages.learningPath.delivering.finished + viewModel.learningPath.id, viewModel.onDeliveringFinished);
        }

        function onDeliveringStarted(learningPath) {
            viewModel.isDelivering(true);
            viewModel.isPublishing(learningPath.isPublishing);
        }

        function onDeliveringFinished(learningPath) {
            viewModel.isDelivering(false);
            viewModel.isPublishing(learningPath.isPublishing);
            viewModel.publicationUrl(learningPath.publicationUrl);
        }
    };

    return ctor;
});