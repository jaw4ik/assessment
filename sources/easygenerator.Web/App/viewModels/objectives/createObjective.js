define(['dataContext', 'models/objective', 'durandal/plugins/router'],
    function (dataContext, ObjectiveModel, router) {
        var self = {};

        self.title = ko.observable().extend([ true, 'dsdfsdf']);
        
        self.title.isModified = ko.observable(true);
        self.title.brokenRules = ko.computed(function () {
            var result = [];
            if (!self.title() || self.title().length < 1) {
                result.push('Please, provide title for objective');
            } else {
                if (self.title().length > 255) {
                    result.push('Objective title can not be lnger than 255 symbols');
                }
            }
            return result;
        });
        self.title.errorMessage = ko.computed(function () {
            return self.title.brokenRules().join(';< br />');
        });
        self.title.isValid = ko.computed(function () {
            return self.title.brokenRules().length == 0;
        });

        self.save = function () {
            if (!self.title.isValid()) {
                self.title.isModified(true);
                return;
            }
            var objective = new ObjectiveModel({ title: self.title() });
            dataContext.objectives.push(objective);
            router.navigateBack();
        };
        self.cancel = function () {
            router.navigateBack();
        };
        self.activate = function () {
            self.title(null);
            self.title.isModified(false);
        };

        return {
            activate: self.activate,
            title: self.title,
            save: self.save,
            cancel: self.cancel
        };
    }
);