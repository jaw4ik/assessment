define(['viewmodels/courses/courseNavigation/items/navigationItem'],
    function (NavigationItem) {
        return function () {
            NavigationItem.call(this, 'publish', 'coursePublishItem', 'Navigate to publish course');
        };
    });
