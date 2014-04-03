define(['viewmodels/courses/courseNavigation/items/navigationItem'],
    function (NavigationItem) {
        return function () {
            NavigationItem.call(this, 'deliver', 'coursePublishItem', 'Navigate to deliver course');
        };
    });
