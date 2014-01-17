define(['repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/deliveringActions/build', 'viewmodels/courses/deliveringActions/scormBuild', 'viewmodels/courses/deliveringActions/publish', 'userContext'],
    function (repository, router, constants, buildDeliveringAction, scormBuildDeliveringAction, publishDeliveringAction, userContext) {

        var viewModel = {
            states: constants.deliveringStates,

            buildAction: ko.observable(),
            scormBuildAction: ko.observable(),
            publishAction: ko.observable(),

            activate: activate,
        };

        viewModel.isDeliveringInProgress = ko.computed(function () {
            return _.some([this.buildAction(), this.scormBuildAction(), this.publishAction()], function (action) {
                return _.isObject(action) && action.isDelivering();
            });
        }, viewModel);

        return viewModel;


        function activate(courseId) {
            return userContext.identify().then(function () {
                return repository.getById(courseId).then(function (course) {
                    viewModel.publishAction(publishDeliveringAction(course.id, course.publishedPackageUrl));
                    viewModel.buildAction(buildDeliveringAction(course.id, course.packageUrl));
                    viewModel.scormBuildAction(userContext.hasStarterAccess() ? scormBuildDeliveringAction(course.id, course.scormPackageUrl) : undefined);
                }).fail(function (reason) {
                    router.activeItem.settings.lifecycleData = { redirect: '404' };
                    throw reason;
                });
            });
        }


    })