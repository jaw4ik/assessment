define(['dataContext', 'constants'],
    function (dataContext, constants) {
        "use strict";
        
        var
            publications = ko.observableArray([]),
            
            currentSortingOption = ko.observable(),

            sortByTitleAsc = function () {
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                publications(_.sortBy(publications(), function (publication) { return publication.title.toLowerCase(); }));
            },
            sortByTitleDesc = function () {
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                publications(_.sortBy(publications(), function (publication) { return publication.title.toLowerCase(); }).reverse());
            },
            
            activate = function () {
                publications(ko.utils.arrayMap(dataContext.publications, function (item) {
                    return { id: item.id, title: item.title, objectives: item.objectives };
                }));
                sortByTitleAsc();
            };

        return {
            activate: activate,
            publications: publications,
            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions
        };
    }
);