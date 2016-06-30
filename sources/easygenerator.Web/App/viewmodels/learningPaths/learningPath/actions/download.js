define(['knockout', 'notify', 'eventTracker', 'fileHelper', 'durandal/app', 'constants', './../queries/getLearningPathByIdQuery'], function (ko, notify, eventTracker, fileHelper, app, constants, getLearningPathByIdQuery) {

    var
       events = {
           downloadLearningPath: 'Download learning path (HTML)'
       };

    var ctor = function () {
        var viewModel = {
            learningPath: null,
            isBuilding: ko.observable(false),
            isDelivering: ko.observable(false),

            download: download,
            onDeliveringStarted: onDeliveringStarted,
            onDeliveringFinished: onDeliveringFinished,

            activate: activate,
            deactivate: deactivate
        }
        return viewModel;

        function download() {
            if (viewModel.isBuilding() || viewModel.isDelivering()) {
                return;
            }

            viewModel.isBuilding(true);
            eventTracker.publish(events.downloadLearningPath);

            return viewModel.learningPath.build().then(function (packageUrl) {
                fileHelper.downloadFile('download/' + packageUrl);
            }).fail(function (message) {
                notify.error(message);
            }).fin(function () {
                viewModel.isBuilding(false);
            });
        }

        function activate(learningPathId) {
            return getLearningPathByIdQuery.execute(learningPathId)
                .then(function(learningPath) {
                    viewModel.learningPath = learningPath;
                    viewModel.isBuilding(learningPath.isBuilding);
                    viewModel.isDelivering(learningPath.isDelivering());

                    app.on(constants.messages.learningPath.delivering.started + viewModel.learningPath.id, viewModel.onDeliveringStarted);
                    app.on(constants.messages.learningPath.delivering.finished + viewModel.learningPath.id, viewModel.onDeliveringFinished);
                }).fail(function () { });
        }

        function deactivate() {
            app.off(constants.messages.learningPath.delivering.started + viewModel.learningPath.id, viewModel.onDeliveringStarted);
            app.off(constants.messages.learningPath.delivering.finished + viewModel.learningPath.id, viewModel.onDeliveringFinished);
        }

        function onDeliveringStarted()
        {
            viewModel.isDelivering(true);
        }

        function onDeliveringFinished() {
            viewModel.isDelivering(false);
        }
    };

    return ctor;
});