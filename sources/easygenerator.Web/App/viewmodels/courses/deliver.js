define(['durandal/app', 'repositories/courseRepository', 'plugins/router', 'services/deliverService', 'notify', 'eventTracker', 'constants', 'dom'], function (app, repository, router, service, notify, eventTracker, constants, dom) {

    var
        events = {
            downloadCourse: 'Download course',
            publishCourse: 'Publish course'
        };
    
    var viewModel = {
        id: '',
        packageUrl: ko.observable(),
        publishedPackageUrl: ko.observable(),
        states: constants.deliveringStates,
        deliveringState: ko.observable(),
        // variable to determine if course is building for publish or for download
        buildingForPublish: ko.observable(),
        
        showOpenLinkDescription: ko.observable(),
        packageCreated: ko.observable(),
        
        downloadCourse: downloadCourse,
        publishCourse: publishCourse,
        
        openPublishedCourse: openPublishedCourse,
        activate: activate,
    };

    viewModel.isDelivering = ko.computed(function () {
        return this.deliveringState() === this.states.building || this.deliveringState() === this.states.publishing;
    }, viewModel);

    viewModel.publishPackageExists = ko.computed(function () {
        return !_.isNullOrUndefined(this.publishedPackageUrl()) && !_.isEmptyOrWhitespace(this.publishedPackageUrl());
    }, viewModel);

    function downloadCourse() {
        if (viewModel.deliveringState() !== constants.deliveringStates.building && viewModel.deliveringState() !== constants.deliveringStates.publishing) {
            viewModel.deliveringState(constants.deliveringStates.building);
            notify.hide();
            eventTracker.publish(events.downloadCourse);

            return repository.getById(viewModel.id).then(function(course) {
                return course.build().then(function() {
                    dom.clickElementById('packageLink');
                });
            });
        }
    }
    
    function publishCourse() {
        if (viewModel.deliveringState() !== constants.deliveringStates.building && viewModel.deliveringState() !== constants.deliveringStates.publishing) {
            viewModel.buildingForPublish(true);
            viewModel.deliveringState(constants.deliveringStates.building);
            notify.hide();
            eventTracker.publish(events.publishCourse);
            return repository.getById(viewModel.id).then(function(course) {
                return course.publish();
            });
        }
    }
    
    function openPublishedCourse() {
        if (viewModel.deliveringState() === constants.deliveringStates.succeed) {
            router.openUrl(viewModel.publishedPackageUrl());
        }
    }

    function activate(courseId) {
        return repository.getById(courseId).then(function (course) {
            viewModel.id = course.id;

            viewModel.deliveringState(_.isNullOrUndefined(course.publishedPackageUrl) || _.isEmptyOrWhitespace(course.publishedPackageUrl) ? constants.deliveringStates.notStarted : constants.deliveringStates.succeed);

            viewModel.packageUrl(course.packageUrl);
            viewModel.publishedPackageUrl(course.publishedPackageUrl);
        }).fail(function (reason) {
            router.activeItem.settings.lifecycleData = { redirect: '404' };
            throw reason;
        });
    }

    app.on(constants.messages.course.build.started).then(function (course) {
        if (course.id === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.building);
        }
    });

    app.on(constants.messages.course.build.completed, function (course) {
        if (course.id === viewModel.id) {
            if (viewModel.buildingForPublish() !== true) {
                viewModel.deliveringState(constants.deliveringStates.succeed);
            }
            viewModel.packageCreated(true);
            viewModel.packageUrl(course.packageUrl);
            viewModel.buildingForPublish(false);
        }
    });

    app.on(constants.messages.course.build.failed, function (courseId) {
        if (courseId === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.failed);
            viewModel.packageUrl('');
            viewModel.buildingForPublish(false);
        }
    });

    app.on(constants.messages.course.publish.started).then(function (course) {
        if (course.id === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.publishing);
        }
    });

    app.on(constants.messages.course.publish.completed, function (course) {
        if (course.id === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.succeed);
            viewModel.publishedPackageUrl(course.publishedPackageUrl);
        }
    });

    app.on(constants.messages.course.publish.failed, function (courseId) {
        if (courseId === viewModel.id) {
            viewModel.deliveringState(constants.deliveringStates.failed);
            viewModel.publishedPackageUrl('');
        }
    });
    
    return viewModel;
})