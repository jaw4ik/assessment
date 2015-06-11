define(['plugins/router', 'eventTracker'],
    function (router, eventTracker) {
        "use strict";

        var
        events = {
            navigateToDetails: 'Navigate to learning path details'
        };

        return function (item) {

            var viewModel = {
                id: item.id,
                title: ko.observable(item.title),
                createdOn: item.createdOn,
                navigateToDetails: navigateToDetails
            };

            return viewModel;

            function navigateToDetails() {
                eventTracker.publish(events.navigateToDetails);
                router.navigate('learningpaths/' + viewModel.id);
            }
        };
    }
);