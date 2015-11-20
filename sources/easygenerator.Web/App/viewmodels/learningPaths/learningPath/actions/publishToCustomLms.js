﻿define(['knockout', 'notify', 'eventTracker', 'clientContext', 'constants', 'plugins/router', 'durandal/app', 'userContext'],
    function (ko, notify, eventTracker, clientContext, constants, router, app, userContext) {

        var
           events = {
               publishLearningPath: 'Publish learning path to custom hosting'
           };

        var ctor = function () {
            var viewModel = {
                learningPath: null,
                companyInfo: null,

                publicationUrl: ko.observable(''),
                isPublishing: ko.observable(false),
                isDelivering: ko.observable(false),
                isPublished: ko.observable(false),

                publishAvailable: ko.observable(true),

                publish: publish,
                onDeliveringStarted: onDeliveringStarted,
                onDeliveringFinished: onDeliveringFinished,

                activate: activate,
                deactivate: deactivate
            }

            return viewModel;

            function publish() {
                if (viewModel.isPublishing() || viewModel.isDelivering()) {
                    return;
                }

                viewModel.isPublishing(true);
                eventTracker.publish(events.publishLearningPath);

                return viewModel.learningPath.publishToCustomLms()
                    .fail(function (message) {
                        notify.error(message);
                    })
                    .fin(function () {
                        viewModel.isPublishing(false);
                    });
            }

            function activate(learningPath) {
                viewModel.learningPath = learningPath;
                viewModel.companyInfo = userContext.identity ? userContext.identity.company : null;

                viewModel.isPublishing(learningPath.isPublishing);
                viewModel.isDelivering(learningPath.isDelivering());
                viewModel.isPublished(learningPath.isPublishedToExternalLms);

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