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
                    return item.title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
                });
            }),

            pageLength = 12,
            displayCount = ko.observable(pageLength),
            totalCount = ko.computed(function () {
                return filteredObjectives().length;
            }),
            pagedObjectives = ko.computed(function () {
                return filteredObjectives().slice(0, displayCount());
            }),
            showMore = function () {
                displayCount(displayCount() + pageLength);
            },
            
            activate = function () {
                objectives(ko.utils.arrayMap(dataContext.objectives, function (item) {
                    return { id: item.id, title: item.title, image: item.image };
                }));
            };

        return {
            activate: activate,
            filter: filter,
            objectives: pagedObjectives,
            displayCount: displayCount,
            totalCount: totalCount,
            showMore: showMore
        };
    }
);