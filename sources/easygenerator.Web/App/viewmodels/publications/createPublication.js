define(['dataContext', 'models/publication', 'durandal/plugins/router', 'constants', 'eventTracker'],
    function (dataContext, PublicationModel, router, constants, eventTracker) {
        var self = {};

        self.title = ko.observable().extend({
            required: { message: 'Please, provide title for publication' },
            maxLength: { message: 'Publication title can not be lnger than 255 symbols', params: 255 }
        });

        self.objectives = ko.observableArray([]);

        self.create = function () {
            if (!self.title.isValid()) {
                self.title.isModified(true);
                return;
            }
            
            dataContext.publications.push(new PublicationModel({
                title: self.title(),
                objectives: self.selectedObjectives()
            }));
            
            eventTracker.publish(constants.events.publicationCreated);
            
            router.navigateTo('#/publications');
        };

        self.selectedObjectives = ko.computed(function () {
            return _.reject(self.objectives(), function(objective) {
                return objective.isSelected === true;
            });
        });

        self.cancel = function () {
            router.navigateTo('#/publications');
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