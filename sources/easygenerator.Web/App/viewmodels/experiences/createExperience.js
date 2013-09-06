define(['repositories/experienceRepository', 'plugins/router', 'constants', 'eventTracker', 'notify', 'localization/localizationManager'],
    function (repository, router, constants, eventTracker, notify, localizationManager) {

        var
            events = {
                category: 'Create Experience',
                navigateToExperiences: 'Navigate to experiences',
                createAndNew: "Create learning experience and create new",
                createAndEdit: "Create learning experience and open its properties",
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var
            title = (function () {
                var val = ko.observable();
                val.maxLength = 255;
                val.extend({
                    required: true,
                    maxLength: val.maxLength
                });
                val.isEditing = ko.observable(false);
                return val;
            })(),

            navigateToExperiences = function () {
                sendEvent(events.navigateToExperiences);
                router.navigate('experiences');
            },

            createAndNew = function () {
                sendEvent(events.createAndNew);

                if (!title.isValid()) {
                    return;
                }

                repository.addExperience({ title: title() }).then(function () {
                    title('');
                    title.isEditing(true);
                    notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                });
            },

            createAndEdit = function () {
                sendEvent(events.createAndEdit);

                if (!title.isValid()) {
                    return;
                }

                repository.addExperience({ title: title() }).then(function (experienceId) {
                    title('');
                    router.navigate('experience/' + experienceId);
                });
            },

            activate = function () {
                return Q.fcall(function () {
                    title('');
                    title.isEditing(true);
                });
            }
        ;

        return {
            activate: activate,
            title: title,

            navigateToExperiences: navigateToExperiences,
            createAndNew: createAndNew,
            createAndEdit: createAndEdit
        };
    }
);