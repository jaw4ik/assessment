define(['constants', 'viewmodels/courses/publishingActions/publishingAction', 'durandal/app', 'notify', 'eventTracker', 'plugins/router', 'clientContext', 'repositories/courseRepository'],
    function (constants, publishingAction, app, notify, eventTracker, router, clientContext, repository) {

        var events = {
            publishCourse: 'Publish course',
            copyEmbedCode: 'Copy embed code',
            copyPublishLink: 'Copy publish link',
        };

        var ctor = function (eventCategory) {

            var viewModel = publishingAction(),
                baseActivate = viewModel.activate;

            viewModel.isPublishing = ko.computed(function () {
                return this.state() === constants.publishingStates.building || this.state() === constants.publishingStates.publishing;
            }, viewModel);

            viewModel.publishCourse = publishCourse;
            viewModel.openPublishedCourse = openPublishedCourse;

            viewModel.courseBuildStarted = courseBuildStarted;
            viewModel.courseBuildFailed = courseBuildFailed;
            viewModel.coursePublishStarted = coursePublishStarted;
            viewModel.coursePublishCompleted = coursePublishCompleted;
            viewModel.coursePublishFailed = coursePublishFailed;
            viewModel.courseStateChanged = courseStateChanged;

            viewModel.courseIsDirty = ko.observable();

            viewModel.frameWidth = ko.observable(_.isNullOrUndefined(clientContext.get(constants.frameSize.width.name)) ? constants.frameSize.width.value : clientContext.get(constants.frameSize.width.name));
            viewModel.frameHeight = ko.observable(_.isNullOrUndefined(clientContext.get(constants.frameSize.height.name)) ? constants.frameSize.height.value : clientContext.get(constants.frameSize.height.name));
            viewModel.embedCode = ko.observable();
            viewModel.validateFrameWidth = validateFrameWidth;
            viewModel.validateFrameHeight = validateFrameHeight;

            viewModel.linkCopied = ko.observable(false);
            viewModel.copyLinkToClipboard = copyLinkToClipboard;
            viewModel.embedCodeCopied = ko.observable(false);
            viewModel.copyEmbedCodeToClipboard = copyEmbedCodeToClipboard;

            viewModel.copyBtnDisabled = ko.observable(false);
            viewModel.activate = activate;
            viewModel.subscriptions = [];

            viewModel.embedCode = ko.computed({
                read: function () {
                    clientContext.set(constants.frameSize.width.name, viewModel.frameWidth());
                    clientContext.set(constants.frameSize.height.name, viewModel.frameHeight());
                    return constants.embedCode.replace('{W}', viewModel.frameWidth()).replace('{H}', viewModel.frameHeight()).replace('{src}', viewModel.packageUrl());
                },
                write: function () { }
            });

            return viewModel;

            function activate(courseId) {
                return repository.getById(courseId).then(function (course) {
                    baseActivate(course, course.publish);

                    viewModel.eventCategory = eventCategory;
                    viewModel.courseIsDirty(course.isDirty);
                    viewModel.linkCopied = ko.observable(false);
                    viewModel.embedCodeCopied = ko.observable(false);
                    viewModel.copyBtnDisabled = ko.observable(false);

                    viewModel.subscribe(constants.messages.course.build.started, viewModel.courseBuildStarted);
                    viewModel.subscribe(constants.messages.course.build.failed, viewModel.courseBuildFailed);

                    viewModel.subscribe(constants.messages.course.publish.started, viewModel.coursePublishStarted);
                    viewModel.subscribe(constants.messages.course.publish.completed, viewModel.coursePublishCompleted);
                    viewModel.subscribe(constants.messages.course.publish.failed, viewModel.coursePublishFailed);
                    viewModel.subscribe(constants.messages.course.stateChanged + courseId, viewModel.courseStateChanged);
                });
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

            function copyLinkToClipboard() {
                eventTracker.publish(events.copyPublishLink, viewModel.eventCategory);
                copyToClipboard(viewModel.linkCopied);
            }

            function copyEmbedCodeToClipboard() {
                eventTracker.publish(events.copyEmbedCode, viewModel.eventCategory);
                copyToClipboard(viewModel.embedCodeCopied);
            }

            function copyToClipboard(value) {
                value(true);
                _.delay(function () {
                    value(false);
                }, constants.copyToClipboardWait);
            }

            function getEmbedCode() {
                return constants.embedCode.replace('{W}', viewModel.frameWidth()).replace('{H}', viewModel.frameHeight()).replace('{src}', viewModel.packageUrl());
            }

            function publishCourse() {
                if (viewModel.isCourseDelivering())
                    return undefined;

                eventTracker.publish(events.publishCourse, viewModel.eventCategory);
                return repository.getById(viewModel.courseId).then(function (course) {
                    return course.publish().fail(function (message) {
                        notify.error(message);
                    });
                });
            }

            function openPublishedCourse() {
                if (viewModel.packageExists()) {
                    router.openUrl(viewModel.packageUrl());
                }
            }

            //#region App-wide events

            function courseStateChanged(state) {
                viewModel.courseIsDirty(state.isDirty);
            }

            function courseBuildStarted(course) {
                if (course.id !== viewModel.courseId || course.publish.state !== constants.publishingStates.building)
                    return;

                viewModel.state(constants.publishingStates.building);
            };

            function courseBuildFailed(course) {
                if (course.id !== viewModel.courseId || course.publish.state !== constants.publishingStates.failed)
                    return;

                viewModel.state(constants.publishingStates.failed);
                viewModel.packageUrl('');
                viewModel.embedCode('');
            };

            function coursePublishStarted(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.publishing);
            };

            function coursePublishCompleted(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.succeed);
                viewModel.packageUrl(course.publish.packageUrl);
                viewModel.embedCode(getEmbedCode());
            };

            function coursePublishFailed(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.failed);
                viewModel.packageUrl('');
            };

            //#endregion

        };

        return ctor;

    });