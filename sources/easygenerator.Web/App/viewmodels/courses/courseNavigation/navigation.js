define(['routing/routingContext', 'viewmodels/courses/courseNavigation/items/define', 'viewmodels/courses/courseNavigation/items/design', 'viewmodels/courses/courseNavigation/items/deliver'],
    function (routingContext, DefineNavigationItem, DesignNavigationItem, DeliverNavigationItem) {
        var items = [];
        var activate = function () {
            this.items = [
                new DefineNavigationItem(),
                new DesignNavigationItem(),
                new DeliverNavigationItem()
            ];
        };

        return {
            activate: activate,
            items: items
        };

    });
