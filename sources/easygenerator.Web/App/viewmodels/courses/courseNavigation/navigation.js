define(['viewmodels/courses/courseNavigation/items/create', 'viewmodels/courses/courseNavigation/items/design', 'viewmodels/courses/courseNavigation/items/deliver'],
    function (CreateNavigationItem, DesignNavigationItem, DeliverNavigationItem) {
        var items = [];
        var activate = function () {
            this.items = [
                new CreateNavigationItem(),
                new DesignNavigationItem(),
                new DeliverNavigationItem()
            ];
        };

        return {
            activate: activate,
            items: items
        };

    });
