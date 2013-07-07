define(['dataContext', 'models/experience', 'durandal/plugins/router', 'constants', 'eventTracker'],
    function (dataContext, ExperienceModel, router, constants, eventTracker) {
        var self = {};

        self.title = ko.observable().extend({
            required: { message: 'Please, provide title for experience' },
            maxLength: { message: 'Experience title can not be longer than 255 symbols', params: 255 }
        });

        self.objectives = ko.observableArray([]);

        self.create = function () {
            if (!self.title.isValid()) {
                self.title.isModified(true);
                return;
            }
            
            dataContext.experiences.push(new ExperienceModel({
                title: self.title(),
                objectives: self.selectedObjectives()
            }));
            
            eventTracker.publish(constants.events.publicationCreated);
            
            router.navigateTo('#/experiences');
        };

        self.selectedObjectives = ko.computed(function () {
            return _.reject(self.objectives(), function(objective) {
                return objective.isSelected === true;
            });
        });

        self.cancel = function () {
            router.navigateTo('#/experiences');
        };

        self.activate = function () {
            return Q.fcall(function() {
                self.title(null);
                self.title.isModified(false);

                self.objectives(ko.utils.arrayMap(dataContext.objectives, function(item) {
                    return {
                        id: item.id,
                        title: item.title,
                        isSelected: ko.observable(false)
                    };
                }));
            });
        };

        return {
            activate: self.activate,
            title: self.title,
            objectives: self.objectives,
            create: self.create,
            cancel: self.cancel
        };
    }
);