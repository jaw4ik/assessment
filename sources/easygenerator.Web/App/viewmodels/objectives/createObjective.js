define(['dataContext', 'models/objective', 'durandal/plugins/router', 'configuration/images'],
    function (dataContext, ObjectiveModel, router, images) {
        var self = {};

        self.title = ko.observable().extend({
            required: { message: 'Please, provide title for objective' },
            maxLength: { message: 'Objective title can not be lnger than 255 symbols', params: 255 }
        });

        self.image = ko.observable();

        self.image.options = images.slice(0, images.length - 1);

        self.image.currentOption = ko.observable(-1);

        self.image.nextOption = function () {
            var index = self.image.options.length > self.image.currentOption() + 1 ? self.image.currentOption() + 1 : 0;
            self.image.currentOption(index);
            self.image(self.image.options[index]);
        };

        self.image.previousOption = function () {
            var index = self.image.currentOption() - 1 < 0 ? self.image.options.length - 1 : self.image.currentOption() - 1;
            self.image.currentOption(index);
            self.image(self.image.options[index]);
        };

        self.save = function () {
            if (!self.title.isValid()) {
                self.title.isModified(true);
                return;
            }
            var objective = new ObjectiveModel({ id: dataContext.objectives.length, title: self.title(), image: self.image(), questions: [] });
            dataContext.objectives.push(objective);
            router.navigateTo('#/');
        };

        self.cancel = function () {
            router.navigateTo('#/');
        };

        self.activate = function () {
            self.title(null);
            self.title.isModified(false);
            self.image.currentOption(-1);
            self.image.nextOption();
        };

        return {
            activate: self.activate,
            title: self.title,
            image: self.image,
            save: self.save,
            cancel: self.cancel
        };
    }
);