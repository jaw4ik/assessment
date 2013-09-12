define(['repositories/objectiveRepository', 'plugins/router', 'eventTracker', 'constants', 'notify', 'localization/localizationManager'],
    function (objectiveRepository, router, eventTracker, constants, notify, localizationManager) {

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                createAndNew: "Create learning objective and create new",
                createAndEdit: "Create learning objective and open it properties",
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var title = ko.observable('');
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.objectiveTitleMaxLength;
        });

        var isTitleEditing = ko.observable(false),

            navigateToObjectives = function () {
                sendEvent(events.navigateToObjectives);
                router.navigate('objectives');
            },

            activate = function () {
                var that = this;

                return Q.fcall(function () {
                    that.title('');
                });
            },

            createAndNew = function () {
                sendEvent(events.createAndNew);
                createObjective(function () {
                    isTitleEditing(true);
                    notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                });
            },

            createAndEdit = function () {
                sendEvent(events.createAndEdit);
                createObjective(function (objectiveId) {
                    router.navigate('objective/' + objectiveId);
                });
            }
        ;

        function createObjective(callback) {
            title(title().trim());

            if (!title.isValid()) {
                return;
            }

            objectiveRepository.addObjective({ title: title() }).then(function (objectiveId) {
                title('');
                callback(objectiveId);
            });
        }

        return {
            title: title,
            objectiveTitleMaxLength: constants.validation.objectiveTitleMaxLength,
            isTitleEditing: isTitleEditing,

            activate: activate,
            navigateToObjectives: navigateToObjectives,
            createAndNew: createAndNew,
            createAndEdit: createAndEdit
        };
    }
);