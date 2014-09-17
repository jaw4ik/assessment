define(['repositories/objectiveRepository', 'plugins/router', 'eventTracker', 'durandal/app', 'constants', 'clientContext', 'userContext', 'notify', 'uiLocker', 'localization/localizationManager', 'repositories/courseRepository', 'ping', 'models/backButton'],
    function (objectiveRepository, router, eventTracker, app, constants, clientContext, userContext, notify, uiLocker, localizationManager, courseRepository, ping, BackButton) {
        "use strict";

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                navigateToCourse: 'Navigate to course details',
                createAndContinue: 'Create learning objective and open it properties',
                collapseObjectiveHint: 'Collapse \"Learning objective hint\"',
                expandObjectiveHint: 'Expand \"Learning objective hint\"'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var title = ko.observable(''),
            isObjectiveTipClosed = ko.observable(false),
            contextCourseId = null,
            contextCourseTitle = null;

        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.objectiveTitleMaxLength;
        });

        var isTitleEditing = ko.observable(false),

            navigateToCourseEvent = function () {
                sendEvent(events.navigateToCourse);
            },

            navigateToObjectivesEvent = function () {
                sendEvent(events.navigateToObjectives);
            },

            activate = function (queryParams) {
                var that = this;

                that.contextCourseId = null;
                that.contextCourseTitle = null;
                that.title('');

                var users = clientContext.get('usersWithClosedCreateObjectiveTip');
                var hasCurrentUser = !_.isNullOrUndefined(users) && _.indexOf(users, userContext.identity.email) != -1;
                that.isObjectiveTipClosed(hasCurrentUser);

                if (!_.isNullOrUndefined(queryParams) && _.isString(queryParams.courseId)) {
                    return courseRepository.getById(queryParams.courseId).then(function (course) {
                        if (_.isNull(course)) {
                            router.replace('404');
                            return;
                        }

                        that.contextCourseId = course.id;
                        that.contextCourseTitle = course.title;

                        that.backButtonData.configure({
                            url: 'course/' + course.id,
                            backViewName: '\'' + course.title + '\'',
                            callback: navigateToCourseEvent,
                            alwaysVisible: false
                        });
                    });
                }

                return Q.fcall(function () {
                    that.backButtonData.configure({
                        url: 'objectives',
                        backViewName: localizationManager.localize('learningObjectives'),
                        callback: navigateToObjectivesEvent,
                        alwaysVisible: true
                    });
                });
            },

            canActivate = function () {
                return ping.execute();
            },

            createAndContinue = function () {
                sendEvent(events.createAndContinue);
                var that = this;
                title(title().trim());

                if (!title.isValid()) {
                    return Q.fcall(function () { });
                }

                uiLocker.lock();
                return objectiveRepository.addObjective({ title: title() }).then(function (createdObjective) {
                    title('');
                    app.trigger(constants.messages.onboarding.objectiveCreated);
                    if (_.isString(that.contextCourseId)) {
                        return objectiveRepository.getById(createdObjective.id).then(function (objective) {
                            return courseRepository.relateObjective(that.contextCourseId, objective.id).then(function () {
                                navigateToObjectiveEditor.call(that, createdObjective);
                            });
                        });
                    } else {
                        navigateToObjectiveEditor.call(that, createdObjective);
                    }
                }).fail(function() {
                    uiLocker.unlock();
                });
            };

        function navigateToObjectiveEditor(createdObjective) {
            var navigateUrl = 'objective/' + createdObjective.id;
            uiLocker.unlock();
            if (_.isString(this.contextCourseId)) {
                router.navigateWithQueryString(navigateUrl);
            } else {
                router.navigate(navigateUrl);
            }
        }

        function showObjectiveTip() {
            sendEvent(events.expandObjectiveHint);
            this.isObjectiveTipClosed(false);

            var users = clientContext.get('usersWithClosedCreateObjectiveTip');
            if (_.isNullOrUndefined(users)) {
                return;
            }

            users = _.reject(users, function (item) { return item == userContext.identity.email; });
            clientContext.set('usersWithClosedCreateObjectiveTip', users);
        }

        function hideObjectiveTip() {
            sendEvent(events.collapseObjectiveHint);
            this.isObjectiveTipClosed(true);

            var users = clientContext.get('usersWithClosedCreateObjectiveTip');
            if (_.isNullOrUndefined(users)) {
                users = [userContext.identity.email];
            } else {
                users.push(userContext.identity.email);
            }

            clientContext.set('usersWithClosedCreateObjectiveTip', users);
        }

        return {
            title: title,

            isObjectiveTipClosed: isObjectiveTipClosed,
            showObjectiveTip: showObjectiveTip,
            hideObjectiveTip: hideObjectiveTip,

            contextCourseId: contextCourseId,
            contextCourseTitle: contextCourseTitle,
            objectiveTitleMaxLength: constants.validation.objectiveTitleMaxLength,
            isTitleEditing: isTitleEditing,

            canActivate: canActivate,
            activate: activate,

            navigateToCourseEvent: navigateToCourseEvent,
            navigateToObjectivesEvent: navigateToObjectivesEvent,
            createAndContinue: createAndContinue,

            backButtonData: new BackButton({})
        };
    }
);