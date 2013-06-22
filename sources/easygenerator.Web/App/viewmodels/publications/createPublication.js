define(['dataContext', 'models/publication', 'durandal/plugins/router'],
    function (dataContext, PublicationModel, router) {
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
            var publication = new PublicationModel({ title: self.title(), objectives: self.selectedObjectives() });
            dataContext.publications.push(publication);
            router.navigateBack();
        };

        self.selectedObjectives = ko.computed(function() {
            var selectedObjectives = [];
            var objectives = self.objectives();

            for (var i = 0; i < objectives.length; i++) {
                if (objectives[i].isSelected()) {
                    selectedObjectives.push(objectives[i].Id);
                }
            }

            return selectedObjectives;
        });

        self.cancel = function () {
            router.navigateBack();
        };

        self.activate = function () {
            self.title(null);
            self.title.isModified(false);
            
            self.objectives(ko.utils.arrayMap(dataContext.objectives, function (item) {
                return {
                    id: item.id,
                    title: item.title,
                    image: item.image,
                    isSelected: ko.observable(false),
                    select: function() {
                        this.isSelected(!this.isSelected());
                    }
                };
            }));
        };

        return {
            activate: self.activate,
            title: self.title,
            create: self.create,
            cancel: self.cancel,
            objectives: self.objectives
        };
    }
);