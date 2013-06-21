define(['dataContext'],
    function (dataContext) {
        var
            objectives = ko.observableArray([]),
            activate = function () {
                objectives(dataContext.objectives);
            };

        return {
            activate: activate,
            objectives: objectives
        };
    }
);