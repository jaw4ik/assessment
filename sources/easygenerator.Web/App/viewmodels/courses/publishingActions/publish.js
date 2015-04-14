﻿define(['constants', 'viewmodels/courses/publishingActions/publishingAction', 'durandal/app', 'notify', 'eventTracker', 'plugins/router', 'clientContext'],
    function (constants, publishingAction, app, notify, eventTracker, router, clientContext) {

        var events = {
            publishCourse: 'Publish course',
            copyEmbedCode: 'Copy embed code',
            copyPublishLink: 'Copy publish link',
        };

        var ctor = function (course, eventCategory) {

            var viewModel = publishingAction(course, course.publish);
            viewModel.isPublishing = ko.computed(function () {
                return this.state() === constants.publishingStates.building || this.state() === constants.publishingStates.publishing;
            }, viewModel);

            viewModel.publishCourse = publishCourse;
            viewModel.openPublishedCourse = openPublishedCourse;
            viewModel.eventCategory = eventCategory;

            viewModel.courseBuildStarted = courseBuildStarted;
            viewModel.courseBuildFailed = courseBuildFailed;
            viewModel.coursePublishStarted = coursePublishStarted;
            viewModel.coursePublishCompleted = coursePublishCompleted;
            viewModel.coursePublishFailed = coursePublishFailed;
            viewModel.courseStateChanged = courseStateChanged;
         
            viewModel.courseHasUnpublishedChanges = ko.observable(course.hasUnpublishedChanges);

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

            app.on(constants.messages.course.build.started).then(viewModel.courseBuildStarted);
            app.on(constants.messages.course.build.failed).then(viewModel.courseBuildFailed);

            app.on(constants.messages.course.publish.started).then(viewModel.coursePublishStarted);
            app.on(constants.messages.course.publish.completed).then(viewModel.coursePublishCompleted);
            app.on(constants.messages.course.publish.failed).then(viewModel.coursePublishFailed);
            app.on(constants.messages.course.stateChanged + course.id).then(viewModel.courseStateChanged);

            viewModel.embedCode = ko.computed({
                read: function () {
                    clientContext.set(constants.frameSize.width.name, viewModel.frameWidth());
                    clientContext.set(constants.frameSize.height.name, viewModel.frameHeight());
                    return constants.embedCode.replace('{W}', viewModel.frameWidth()).replace('{H}', viewModel.frameHeight()).replace('{src}', viewModel.packageUrl());
                },
                write: function () { }
            });

            return viewModel;

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
                return constants.embedCode.replace('{W}', viewModel.frameWidth()).replace('{H}', viewModel.frameHeight()).replace('{src}', course.publish.packageUrl);
            }

            function publishCourse() {
                if (viewModel.isCourseDelivering())
                    return undefined;

                eventTracker.publish(events.publishCourse, viewModel.eventCategory);

                return course.publish().fail(function (message) {
                    notify.error(message);
                });
            };

            function openPublishedCourse() {
                if (viewModel.packageExists()) {
                    router.openUrl(viewModel.packageUrl());
                }
            };

            //#region App-wide events

            function courseStateChanged(state) {
                viewModel.courseHasUnpublishedChanges(state.hasUnpublishedChanges);
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