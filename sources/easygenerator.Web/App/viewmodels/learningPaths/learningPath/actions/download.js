define(['knockout', 'notify', 'eventTracker', 'fileHelper'], function (ko, notify, eventTracker, fileHelper) {

    var
       events = {
           downloadLearningPath: 'Download learning path (HTML)'
       };

    var ctor = function () {
        var viewModel = {
            learningPath: null,
            isPublishing: ko.observable(false),

            download: download,
            activate: activate
        }
        return viewModel;

        function download() {
            if (viewModel.isPublishing()) {
                return;
            }

            viewModel.isPublishing(true);
            eventTracker.publish(events.downloadLearningPath);

            return viewModel.learningPath.build().then(function (packageUrl) {
                fileHelper.downloadFile('download/' + packageUrl);
            }).fail(function (message) {
                notify.error(message);
            }).fin(function() {
                viewModel.isPublishing(false);
            });
        }

        function activate(learningPath) {
            viewModel.learningPath = learningPath;
            viewModel.isPublishing(learningPath.isDelivering);
        }
    };

    return ctor;
});