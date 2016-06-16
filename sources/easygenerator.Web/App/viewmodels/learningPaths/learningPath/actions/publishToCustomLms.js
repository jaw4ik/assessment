define(['knockout', 'notify', 'eventTracker', 'clientContext', 'constants', 'routing/router', 'durandal/app', 'userContext', './../queries/getLearningPathByIdQuery'],
    function (ko, notify, eventTracker, clientContext, constants, router, app, userContext, getLearningPathByIdQuery) {

        var
           events = {
               publishLearningPath: 'Publish learning path to custom hosting'
           };

        var ctor = function () {
            var viewModel = {
                learningPath: null,
                companyInfo: null,

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

                return viewModel.learningPath.publishToCustomLms(viewModel.companyInfo.id)
                    .then(function() {
                        viewModel.isPublished(true);
                    })
                    .fail(function (message) {
                        notify.error(message);
                    })
                    .fin(function () {
                        viewModel.isPublishing(false);
                    });
            }

            function activate(publishData) {
                return getLearningPathByIdQuery.execute(publishData.learningPathId)
                    .then(function (learningPath) {
                        viewModel.companyInfo = publishData.companyInfo;
                        viewModel.learningPath = learningPath;

                        viewModel.isPublishing(learningPath.isPublishing);
                        viewModel.isDelivering(learningPath.isDelivering());
                        viewModel.isPublished(!!learningPath.learningPathCompanies.find(function (company) {
                            return company.id === viewModel.companyInfo.id;
                        }));

                        app.on(constants.messages.learningPath.delivering.started + viewModel.learningPath.id, viewModel.onDeliveringStarted);
                        app.on(constants.messages.learningPath.delivering.finished + viewModel.learningPath.id, viewModel.onDeliveringFinished);
                    }).fail(function() {});
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
                viewModel.isPublished(!!learningPath.learningPathCompanies.find(function (company) {
                    return company.id === viewModel.companyInfo.id;
                }));
            }
        };

        return ctor;
    });