define(['dataContext'],
    function (dataContext) {
        var
            publications = ko.observableArray([]),
            filter = ko.observable(),

            activate = function () {
                publications(ko.utils.arrayMap(dataContext.publications, function (item) {
                    return { id: item.id, title: item.title, objectives: item.objectives };
                }));
            },

            filteredPublications = ko.computed(function () {
                var filterValue = filter();
                if (!filterValue) {
                    return publications();
                }

                return ko.utils.arrayFilter(publications(), function (item) {
                    return item.title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
                });
            }),

            pageLength = 12,

            displayCount = ko.observable(pageLength),

            totalCount = ko.computed(function () {
                return filteredPublications().length;
            }),

            pagedPublications = ko.computed(function () {
                return filteredPublications().slice(0, displayCount());
            }),

            showMore = function () {
                displayCount(displayCount() + pageLength);
            };

        return {
            activate: activate,
            filter: filter,
            publications: pagedPublications,
            displayCount: displayCount,
            totalCount: totalCount,
            showMore: showMore
        };
    }
);