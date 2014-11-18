define(['viewmodels/courses/courseNavigation/items/navigationItem'],
    function (NavigationItem) {
        return function () {
            NavigationItem.call(this, 'results', 'courseResultsItem', 'Navigate to results');
        };
    });
