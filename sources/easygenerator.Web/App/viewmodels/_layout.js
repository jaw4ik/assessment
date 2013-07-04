define(['durandal/plugins/router', 'configuration/routes', 'dataContext'],
    function (router, routes, datacontext) {
        var
            startModule = 'objectives',
            activate = function () {
                return datacontext.initialize()
                    .then(function () {
                        router.map(routes);
                        return router.activate(startModule);
                    });
            };

        return {
            activate: activate,
            router: router
        };
    }
);