define(['dataContext'],
    function (dataContext) {
        var
            objectives = ko.observableArray([]),
            filter = ko.observable(),
            filteredObjectives = ko.computed(function () {
                var filterValue = filter();
                if (!filterValue) {
                    return objectives();
                }
                return ko.utils.arrayFilter(objectives(), function (item) {
                    return item.title.indexOf(filterValue) !== -1;
                });
            }),
            activate = function () {
                objectives(ko.utils.arrayMap(dataContext.objectives, function (item) {
                    return { id: item.id, title: item.title };
                }));
            };

        return {
            activate: activate,
            filter: filter,
            objectives: filteredObjectives
        };
    }
);