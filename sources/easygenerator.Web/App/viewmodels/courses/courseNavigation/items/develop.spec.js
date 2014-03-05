define(['viewmodels/courses/courseNavigation/items/develop', 'plugins/router'],
    function (DevelopNavigationItemViewModel, router) {

        describe('viewmodel [developNavigationItem]', function () {
            it('should be defined', function () {
                expect(DevelopNavigationItemViewModel).toBeDefined();
            });
        });

        describe('isActive:', function () {
            var navigationItem;

            beforeEach(function() {
                router.routeData({});
                navigationItem = new DevelopNavigationItemViewModel();
            });
            
            it('should be computed', function () {
                expect(navigationItem.isActive).toBeComputed();
            });

            describe('when module name is equal to \'design\'', function () {
                it('should be false', function () {
                    router.routeData({
                        courseId: 'courseId',
                        moduleName: 'design'
                    });
                    expect(navigationItem.isActive()).toBeFalsy();
                });
            });

            describe('when module name is equal to \'deliver\'', function () {
                it('should be false', function () {
                    router.routeData({
                        courseId: 'courseId',
                        moduleName: 'deliver'
                    });
                    expect(navigationItem.isActive()).toBeFalsy();
                });
            });
            
            describe('when module name is not equal to \'design\' and \'deliver\'', function () {
                it('should be true', function () {
                    router.routeData({
                        courseId: 'courseId',
                        moduleName: 'moduleName'
                    });
                    expect(navigationItem.isActive()).toBeTruthy();
                });
            });
        });
    });