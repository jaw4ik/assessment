define(['dataContext', 'models/objective', 'durandal/plugins/router'],
    function (dataContext, ObjectiveModel, router) {
        var
            title = ko.observable(),
            save = function () {
                var objective = new ObjectiveModel({ title: title() });
                dataContext.objectives.push(objective);
                router.navigateBack();
            },
            cancel = function () {
                router.navigateBack();
            },
            activate = function () {
                title(null);
            };

        return {
            activate: activate,
            title: title,
            save: save,
            cancel: cancel
        };
    }
);