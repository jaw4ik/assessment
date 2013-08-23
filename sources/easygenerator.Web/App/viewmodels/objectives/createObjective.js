define(['repositories/objectiveRepository', 'services/navigation', 'eventTracker'],
    function (objectiveRepository, router, eventTracker) {

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

        var
            title = ko.observable('').extend({
                required: true,
                maxLength: 255
            }),
            validationVisible = ko.observable(false),

            navigateToObjectives = function () {
                sendEvent(events.navigateToObjectives);
                router.navigate('objectives');
            },

            activate = function () {
                var that = this;

                return Q.fcall(function () {
                    that.validationVisible(false);
                    that.title('');
                });
            },

            createAndNew = function () {
                sendEvent(events.createAndNew);

                if (!title.isValid()) {
                    validationVisible(true);
                    return;
                }

                objectiveRepository.add(title()).then(function (addedObjective) {
                    title('');
                    validationVisible(false);
                    return;
                });
            },

            createAndEdit = function () {
                sendEvent(events.createAndEdit);
                
                if (!title.isValid()) {
                    validationVisible(true);
                    return;
                }
                
                objectiveRepository.add(title()).then(function (addedObjective) {
                    router.navigate('objective/' + addedObjective.id);
                    return;
                });
            };


        return {
            title: title,
            validationVisible: validationVisible,

            activate: activate,
            navigateToObjectives: navigateToObjectives,
            createAndNew: createAndNew,
            createAndEdit: createAndEdit
        };
    }
);