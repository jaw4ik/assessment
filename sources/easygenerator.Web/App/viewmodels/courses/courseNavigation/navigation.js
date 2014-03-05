define(['viewmodels/courses/courseNavigation/items/develop', 'viewmodels/courses/courseNavigation/items/design', 'viewmodels/courses/courseNavigation/items/deliver'],
    function (DevelopNavigationItem, DesignNavigationItem, DeliverNavigationItem) {
        var items = [];
        var activate = function () {
            this.items = [
                new DevelopNavigationItem(),
                new DesignNavigationItem(),
                new DeliverNavigationItem()
            ];
        };

        return {
            activate: activate,
            items: items
        };

    });
