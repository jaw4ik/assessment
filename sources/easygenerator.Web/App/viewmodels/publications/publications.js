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
            });

        return {
            activate: activate,
            filter: filter,
            publications: filteredPublications
        };
    }
);