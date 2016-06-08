define(['routing/router', 'analytics/providers'],
    function (router, analyticsProviders) {

        return {
            publish: publish
        };

        function publish(eventName, eventCategory) {
            var activeInstruction = getActiveInstruction();

            var category = '';

            if (_.isString(eventCategory)) {
                category = eventCategory;
            } else {
                category = _.isObject(activeInstruction) ? activeInstruction.config.title : 'Default category';
            }

            analyticsProviders.publish(eventName, category);
        }

        function getActiveInstruction() {
            return (function getInstruction(router) {
                return router.activeItem && router.activeItem() && router.activeItem().router
                    ? getInstruction(router.activeItem().router)
                    : router.activeInstruction();
            })(router);
        }

    }
);