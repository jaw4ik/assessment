define(['dataContext'],
    function (dataContext) {
        var
            objectives = ko.observableArray([]),
            filter = ko.observable(),
            filteredObjectives = ko.computed(function () {
                console.log(objectives())
                var filterValue = filter();
                if (!filterValue) {
                    return objectives();
                }
                return ko.utils.arrayFilter(objectives(), function (item) {
                    return item.title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
                });
            }),
            activate = function () {
                objectives(ko.utils.arrayMap(dataContext.objectives, function (item) {
                    return { id: item.id, title: item.title, image: item.image };
                }));
            };

        return {
            activate: activate,
            filter: filter,
            objectives: filteredObjectives
        };
    }
);