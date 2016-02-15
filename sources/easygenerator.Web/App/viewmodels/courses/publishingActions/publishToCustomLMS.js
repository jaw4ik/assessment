define(['constants', 'notify', 'eventTracker', 'userContext', 'repositories/courseRepository', 'viewmodels/courses/publishingActions/publishingAction'],
    function (constants, notify, eventTracker, userContext, repository, publishingAction) {
        "use strict";

        var events = {
            publishToCustomLms: 'Publish course to custom hosting'
        };

        var ctor = function (eventCategory) {

            var viewModel = publishingAction(),
                baseActivate = viewModel.activate;

            viewModel.courseId = null;
            viewModel.companyInfo = null;
            viewModel.eventCategory = eventCategory;

            viewModel.isDirty = ko.observable();
            viewModel.isPublishingToLms = ko.observable(false);
            viewModel.isPublished = ko.observable(false);

            viewModel.isPublishing = ko.computed(function () {
                return viewModel.isCourseDelivering() || viewModel.isPublishingToLms();
            });

            viewModel.publishToCustomLms = publishToCustomLms;
            viewModel.activate = activate;

            viewModel.courseStateChanged = courseStateChanged;
            viewModel.coursePublishStarted = coursePublishStarted;
            viewModel.coursePublishCompleted = coursePublishCompleted;
            viewModel.coursePublishFailed = coursePublishFailed;

            return viewModel;

            function activate(publishData) {
                return repository.getById(publishData.courseId).then(function(course) {
                    baseActivate(course, course.publish);

                    viewModel.companyInfo = publishData.companyInfo;
                    viewModel.courseId = course.id;
                    viewModel.isPublished(!!course.courseCompanies.find(function(company) {
                        return company.id === viewModel.companyInfo.id;
                    }));
                    viewModel.isDirty(course.isDirty);

                    viewModel.subscribe(constants.messages.course.stateChanged + course.id, viewModel.courseStateChanged);
                    viewModel.subscribe(constants.messages.course.publishToCustomLms.started, viewModel.coursePublishStarted);
                    viewModel.subscribe(constants.messages.course.publishToCustomLms.completed, viewModel.coursePublishCompleted);
                    viewModel.subscribe(constants.messages.course.publishToCustomLms.failed, viewModel.coursePublishFailed);
                }).fail(function() {});
            }

            function publishCourse() {
                return Q.fcall(function () {
                    if (!viewModel.packageExists() || viewModel.isDirty()) {
                        return repository.getById(viewModel.courseId).then(function (course) {
                            return course.publish().fail(function (message) {
                                notify.error(message);
                            });
                        });
                    }
                    return null;
                });
            }

            function publishToCustomLms() {
                eventTracker.publish(events.publishToCustomLms, viewModel.eventCategory);

                return publishCourse().then(function () {
                    if (!viewModel.isPublished()) {
                        return repository.getById(viewModel.courseId).then(function (course) {
                            return course.publishToCustomLms(viewModel.companyInfo.id);
                        });
                    }
                });
            }

            //#region App-wide events

            function courseStateChanged(state) {
                viewModel.isDirty(state.isDirty);
            }

            function coursePublishStarted(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.isPublishingToLms(true);
            };

            function coursePublishCompleted(course) {
                if (course.id !== viewModel.courseId)
                    return;
                
                viewModel.isPublishingToLms(false);

                if (course.courseCompanies.find(function (item) {
                    return item.id === viewModel.companyInfo.id;
                })) {
                    viewModel.isPublished(true);
                }
            };

            function coursePublishFailed(course, message) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.isPublishingToLms(false);
                notify.error(message);
            };

            //#endregion

        };

        return ctor;
    }
);