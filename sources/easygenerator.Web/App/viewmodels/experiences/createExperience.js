define(['dataContext', 'models/experience', 'durandal/plugins/router', 'constants', 'eventTracker'],
    function (dataContext, ExperienceModel, router, constants, eventTracker) {
        var self = {};

        var
            events = {
                category: 'Create Experience',
                createExperience: 'Create experience',
                navigateToExperiences: 'Navigate to experiences',
                cancelExperienceCreateion: 'Cancel experience creation'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        self.title = ko.observable().extend({
            required: { message: 'Please, provide title for experience' },
            maxLength: { message: 'Experience title can not be longer than 255 symbols', params: 255 }
        });

        self.objectives = ko.observableArray([]);

        self.save = function () {
            if (!self.title.isValid()) {
                self.title.isModified(true);
                return;
            }
            
            sendEvent(events.createExperience);
            
            dataContext.experiences.push(new ExperienceModel({
                id: dataContext.experiences.length,
                title: self.title(),
                objectives: self.selectedObjectives()
            }));

            sendEvent(events.navigateToExperiences);
            router.navigateTo('#/experiences');
        };

        self.selectedObjectives = ko.computed(function () {
            return _.reject(self.objectives(), function (objective) {
                return objective.isSelected() !== true;
            });
        });

        self.cancel = function () {
            sendEvent(events.cancelExperienceCreateion);
            sendEvent(events.navigateToExperiences);
            router.navigateTo('#/experiences');
        };

        self.activate = function () {
            self.title(null);
            self.title.isModified(false);

            self.objectives(ko.utils.arrayMap(dataContext.objectives, function (item) {
                return {
                    id: item.id,
                    title: item.title,
                    isSelected: ko.observable(false)
                };
            }));
        };

        return {
            activate: self.activate,
            title: self.title,
            objectives: self.objectives,
            save: self.save,
            cancel: self.cancel
        };
    }
);