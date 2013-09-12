define(['repositories/experienceRepository', 'plugins/router', 'constants', 'eventTracker', 'notify', 'localization/localizationManager'],
    function (repository, router, constants, eventTracker, notify, localizationManager) {

        var
            events = {
                navigateToExperiences: 'Navigate to experiences',
                createAndNew: "Create learning experience and create new",
                createAndEdit: "Create learning experience and open its properties",
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var title = ko.observable('');
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.experienceTitleMaxLength;
        });
        title.isEditing = ko.observable();

        var navigateToExperiences = function () {
                sendEvent(events.navigateToExperiences);
                router.navigate('experiences');
            },

            createAndNew = function () {
                sendEvent(events.createAndNew);
                createExperience(function () {
                    title.isEditing(true);
                    notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                });
            },

            createAndEdit = function () {
                sendEvent(events.createAndEdit);
                createExperience(function (experienceId) {
                    router.navigate('experience/' + experienceId);
                });
            },

            activate = function () {
                return Q.fcall(function () {
                    title('');
                });
            }
        ;

        function createExperience(callback) {
            if (!title.isValid()) {
                return;
            }

            repository.addExperience({ title: title().trim() }).then(function (experienceId) {
                title('');
                callback(experienceId);
            });
        }

        return {
            activate: activate,
            title: title,
            experienceTitleMaxLength: constants.validation.experienceTitleMaxLength,

            navigateToExperiences: navigateToExperiences,
            createAndNew: createAndNew,
            createAndEdit: createAndEdit
        };
    }
);