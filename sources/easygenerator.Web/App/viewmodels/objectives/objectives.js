define(['dataContext', 'constants', 'durandal/plugins/router'],
    function (dataContext, constants, router) {
        "use strict";

        var
            objectives = ko.observableArray([]),

            currentSortingOption = ko.observable(),

            sortByTitleAsc = function () {
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                objectives(_.sortBy(objectives(), function (objective) { return objective.title.toLowerCase(); }));
            },
            sortByTitleDesc = function () {
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                objectives(_.sortBy(objectives(), function (objective) { return objective.title.toLowerCase(); }).reverse());
            },

            goToDetails = function (item) {
                var url = '#/objective/' + item.id;
                router.navigateTo(url);
            },

            activate = function () {
                return Q.fcall(function () {
                    objectives(ko.utils.arrayMap(dataContext.objectives, function (item) {
                        return { id: item.id, title: item.title, image: item.image, isSelected: ko.observable(false), toggleSelection: function () { this.isSelected(!this.isSelected()); } };
                    }));
                    sortByTitleAsc();
                });
            };

        return {
            activate: activate,
            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,
            objectives: objectives,
            goToDetails: goToDetails
        };
    }
);