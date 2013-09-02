define(['repositories/objectiveRepository', 'plugins/router', 'eventTracker', 'constants', 'localization/localizationManager'],
    function (objectiveRepository, router, eventTracker, constants, localizationManager) {

        var
            events = {
                category: 'Create learning objective',
                navigateToObjectives: 'Navigate to objectives',
                createAndNew: "Create learning objective and create new",
                createAndEdit: "Create learning objective and open it properties",
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var notification = {
            text: ko.observable(''),
            visibility: ko.observable(false),
            close: function () { notification.visibility(false); },
            update: function () {
                var message = localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString();
                notification.text(message);
                notification.visibility(true);
            }
        };

        var
            title = ko.observable('').extend({
                required: true,
                maxLength: constants.validation.objectiveTitleMaxLength
            }),
            isTitleEditing = ko.observable(false),

            navigateToObjectives = function () {
                sendEvent(events.navigateToObjectives);
                router.navigate('objectives');
            },

            activate = function () {
                var that = this;

                return Q.fcall(function () {
                    that.title('');
                    that.notification.visibility(false);
                });
            },

            createAndNew = function () {
                sendEvent(events.createAndNew);

                title(title().trim());

                if (!title.isValid()) {
                    return;
                }

                objectiveRepository.addObjective({ title: title() }).then(function () {
                    title('');
                    isTitleEditing(true);
                    notification.update();
                });
            },

            createAndEdit = function () {
                sendEvent(events.createAndEdit);

                title(title().trim());

                if (!title.isValid()) {
                    return;
                }
                
                objectiveRepository.addObjective({ title: title() }).then(function (objectiveId) {
                    router.navigate('objective/' + objectiveId);
                });
            },

            attached = function () {
                var that = this;
                setTimeout(function () {
                    that.isTitleEditing(true);
                }, 100);
            };


        return {
            title: title,
            objectiveTitleMaxLength: constants.validation.objectiveTitleMaxLength,
            isTitleEditing: isTitleEditing,
            notification: notification,

            activate: activate,
            attached: attached,
            navigateToObjectives: navigateToObjectives,
            createAndNew: createAndNew,
            createAndEdit: createAndEdit
        };
    }
);