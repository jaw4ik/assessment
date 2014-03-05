define(['viewmodels/courses/courseNavigation/items/navigationItem'],
    function (NavigationItem) {
        return function () {
            NavigationItem.call(this, 'deliver', 'courseDeliver', 'Navigate to deliver course');
        };
    });
