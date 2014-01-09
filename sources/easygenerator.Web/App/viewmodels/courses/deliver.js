define(['repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/deliveringActions/build', 'viewmodels/courses/deliveringActions/scormBuild', 'viewmodels/courses/deliveringActions/publish'],
    function (repository, router, constants, buildDeliveringAction, scormBuildDeliveringAction, publishDeliveringAction) {

        var viewModel = {
            states: constants.deliveringStates,

            buildAction: ko.observable(),
            scormBuildAction: ko.observable(),
            publishAction: ko.observable(),

            activate: activate,
        };

        viewModel.isDeliveringInProgress = ko.computed(function () {
            return (_.isObject(this.buildAction()) && this.buildAction().isDelivering()) ||
                (_.isObject(this.scormBuildAction()) && this.scormBuildAction().isDelivering()) ||
                (_.isObject(this.publishAction()) && this.publishAction().isDelivering());
        }, viewModel);

        function activate(courseId) {
            return repository.getById(courseId).then(function (course) {
                viewModel.publishAction(publishDeliveringAction(course.id, course.publishedPackageUrl));
                viewModel.buildAction(buildDeliveringAction(course.id, course.packageUrl));
                viewModel.scormBuildAction(scormBuildDeliveringAction(course.id, course.scormPackageUrl));
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        return viewModel;
    })