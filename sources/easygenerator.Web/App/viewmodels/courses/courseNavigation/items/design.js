define(['viewmodels/courses/courseNavigation/items/navigationItem'],
    function (NavigationItem) {
        return function () {
            NavigationItem.call(this, 'design', 'courseDesignItem', 'Navigate to design course');
        };
    });