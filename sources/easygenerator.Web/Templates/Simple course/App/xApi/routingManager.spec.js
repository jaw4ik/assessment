define(['xApi/routingManager', 'plugins/router'],
    function (routingManager, router) {

        describe('viewModel [routingManager]', function () {

            it('should be defined', function () {
                expect(routingManager).toBeDefined();
            });

            describe('mapRoutes:', function () {

                it('should be function', function () {
                    expect(routingManager.mapRoutes).toBeFunction();
                });

                it('should map routes', function () {
                    spyOn(router, 'map');
                    routingManager.mapRoutes();
                    expect(router.map).toHaveBeenCalled();
                });

                it('should change routeGuard', function () {
                    var guard = router.guardRoute;
                    routingManager.mapRoutes();
                    expect(router.guardRoute).not.toBe(guard);
                });

            });

            describe('removeRoutes:', function() {

                it('should be function', function() {
                    expect(routingManager.removeRoutes).toBeFunction();
                });

                it('should change routeGuard', function () {
                    var guard = router.guardRoute;
                    routingManager.removeRoutes();
                    expect(router.guardRoute).not.toBe(guard);
                });

            });

        });

    }
);