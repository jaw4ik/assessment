define(['durandal/app', 'repositories/courseRepository', 'plugins/router', 'services/deliverService', 'notify', 'eventTracker', 'constants',
    'dom', 'viewmodels/courses/deliveringActions/build', 'viewmodels/courses/deliveringActions/scormBuild', 'viewmodels/courses/deliveringActions/publish'],
    function (app, repository, router, service, notify, eventTracker, constants, dom, buildDeliveringAction, scormBuildDeliveringAction, publishDeliveringAction) {

        var
            events = {
                downloadCourse: 'Download course',
                downloadScormCourse: 'Download scorm course',
                publishCourse: 'Publish course'
            };

        var viewModel = {
            id: '',
            states: constants.deliveringStates,
            packageUrl: ko.observable(),
            scormPackageUrl: ko.observable(),
            publishedPackageUrl: ko.observable(),

            activeAction: ko.observable(null),
            buildAction: ko.observable(),
            scormBuildAction: ko.observable(),
            publishAction: ko.observable(),

            showOpenLinkDescription: ko.observable(),
            packageCreated: ko.observable(),

            downloadCourse: downloadCourse,
            downloadScormCourse: downloadScormCourse,
            publishCourse: publishCourse,

            openPublishedCourse: openPublishedCourse,
            activate: activate,
        };

        viewModel.isDelivering = ko.computed(function () {
            return _.isNullOrUndefined(this.activeAction()) ? false : this.activeAction().isDelivering();
        }, viewModel);

        viewModel.publishPackageExists = ko.computed(function () {
            return !_.isNullOrUndefined(this.publishedPackageUrl()) && !_.isEmptyOrWhitespace(this.publishedPackageUrl());
        }, viewModel);

        function downloadCourse() {
            if (viewModel.isDelivering())
                return undefined;

            viewModel.activeAction(viewModel.buildAction());

            notify.hide();
            eventTracker.publish(events.downloadCourse);

            return repository.getById(viewModel.id).then(function (course) {
                return course.build().then(function () {
                    dom.clickElementById('packageLink');
                });
            });
        }

        function downloadScormCourse() {
            if (viewModel.isDelivering())
                return undefined;

            viewModel.activeAction(viewModel.scormBuildAction());
            notify.hide();
            eventTracker.publish(events.downloadScormCourse);

            return repository.getById(viewModel.id).then(function (course) {
                return course.scormBuild().then(function () {
                    dom.clickElementById('scormPackageLink');
                });
            });
        }

        function publishCourse() {
            if (viewModel.isDelivering())
                return undefined;

            viewModel.activeAction(viewModel.publishAction());
            notify.hide();
            eventTracker.publish(events.publishCourse);
            return repository.getById(viewModel.id).then(function (course) {
                return course.publish();
            });
        }

        function openPublishedCourse() {
            if (viewModel.publishAction().state() === constants.deliveringStates.succeed) {
                router.openUrl(viewModel.publishedPackageUrl());
            }
        }

        function activate(courseId) {
            return repository.getById(courseId).then(function (course) {
                viewModel.id = course.id;

                viewModel.publishAction(publishDeliveringAction);
                viewModel.publishAction().state(constants.deliveringStates.succeed);
                viewModel.buildAction(buildDeliveringAction);
                viewModel.buildAction().state(constants.deliveringStates.succeed);
                viewModel.scormBuildAction(scormBuildDeliveringAction);
                viewModel.scormBuildAction().state(constants.deliveringStates.succeed);

                viewModel.packageUrl(course.packageUrl);
                viewModel.scormPackageUrl(course.scormPackageUrl);
                viewModel.publishedPackageUrl(course.publishedPackageUrl);
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        app.on(constants.messages.course.build.started).then(function (course) {
            if (course.id !== viewModel.id)
                return;

            viewModel.activeAction().state(constants.deliveringStates.building);
        });

        app.on(constants.messages.course.build.completed, function (course) {
            if (course.id !== viewModel.id)
                return;
            
            if (viewModel.activeAction() === viewModel.buildAction()) {
                viewModel.activeAction().state(constants.deliveringStates.succeed);
                viewModel.packageUrl(course.packageUrl);
            }
            if (viewModel.activeAction() === viewModel.scormBuildAction()) {
                viewModel.activeAction().state(constants.deliveringStates.succeed);
                viewModel.scormPackageUrl(course.scormPackageUrl);
            }

            viewModel.packageCreated(true);
        });

        app.on(constants.messages.course.build.failed, function (courseId) {
            if (courseId !== viewModel.id)
                return;

            viewModel.activeAction().state(constants.deliveringStates.failed);
            viewModel.packageUrl('');
        });

        app.on(constants.messages.course.publish.started).then(function (course) {
            if (course.id !== viewModel.id)
                return;

            viewModel.activeAction().state(constants.deliveringStates.publishing);
        });

        app.on(constants.messages.course.publish.completed, function (course) {
            if (course.id !== viewModel.id)
                return;

            viewModel.activeAction().state(constants.deliveringStates.succeed);
            viewModel.publishedPackageUrl(course.publishedPackageUrl);
        });

        app.on(constants.messages.course.publish.failed, function (courseId) {
            if (courseId !== viewModel.id)
                return;

            viewModel.activeAction().state(constants.deliveringStates.failed);
            viewModel.publishedPackageUrl('');
        });

        return viewModel;
    })