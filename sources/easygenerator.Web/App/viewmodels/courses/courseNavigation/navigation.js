define(['viewmodels/courses/courseNavigation/items/create', 'viewmodels/courses/courseNavigation/items/design', 'viewmodels/courses/courseNavigation/items/publish'],
    function (CreateNavigationItem, DesignNavigationItem, PublishNavigationItem) {
        var items = [];
        var activate = function () {
            this.items = [
                new CreateNavigationItem(),
                new DesignNavigationItem(),
                new PublishNavigationItem()
            ];
        };

        return {
            activate: activate,
            items: items
        };

    });
