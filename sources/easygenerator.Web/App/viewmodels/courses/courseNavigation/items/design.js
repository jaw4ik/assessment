define(['viewmodels/courses/courseNavigation/items/navigationItem'],
    function (NavigationItem) {
        return function () {
            NavigationItem.call(this, 'design', 'courseDesign', 'Navigate to design course');
        };
    });