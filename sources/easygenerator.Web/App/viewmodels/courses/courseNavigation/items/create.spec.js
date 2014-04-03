define(['viewmodels/courses/courseNavigation/items/create', 'plugins/router'],
    function (CreateNavigationItemViewModel, router) {

        describe('viewmodel [createNavigationItem]', function () {
            it('should be defined', function () {
                expect(CreateNavigationItemViewModel).toBeDefined();
            });
        });

        describe('isActive:', function () {
            var navigationItem;

            beforeEach(function() {
                router.routeData({});
                navigationItem = new CreateNavigationItemViewModel();
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