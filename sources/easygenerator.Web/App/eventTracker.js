define(['plugins/router', 'analytics/providers'],
    function (router, analyticsProviders) {

        function publish(eventName, eventCategory) {
            var activeInstruction = router.activeInstruction();

            var category = '';

            if (_.isString(eventCategory)) {
                category = eventCategory;
            } else {
                category = _.isObject(activeInstruction) ? activeInstruction.config.title : 'Default category';
            }

            analyticsProviders.publish(eventName, category);
        }

        return {
            publish: publish
        };
    });