define(['viewmodels/courses/courseNavigation/items/navigationItem', 'eventTracker', 'plugins/router'],
    function (NavigationItem, eventsTracker, router) {
        describe('viewmodel [navigationItem]', function () {

            it('should be defined', function () {
                expect(NavigationItem).toBeDefined();
            });

            var itemId = 'navigationItemId';
            var itemTitle = 'navigationItemTitle';
            var eventName = 'eventName';
            var courseId = 'courseId';
            var moduleName = 'moduleName';

            var navigationItem;
            
            beforeEach(function () {
                router.routeData({
                    courseId: courseId,
                    moduleName: moduleName
                });
                navigationItem = new NavigationItem(itemId, itemTitle, eventName);
            });

            describe('title:', function () {
                it('should be defined', function () {
                    expect(navigationItem.title).toBeDefined();
                });

                it('should be equal to \'itemTitle\' constructor param', function () {
                    expect(navigationItem.title).toBe(itemTitle);
                });
            });
            
            describe('navigate:', function () {
                beforeEach(function () {
                    spyOn(eventsTracker, 'publish');
                    spyOn(router, 'navigate');
                });

                it('should be function', function () {
                    expect(navigationItem.navigate).toBeFunction();
                });

                it('should publish event equal to \'eventName\' constructor param', function () {
                    navigationItem.navigate();
                    expect(eventsTracker.publish).toHaveBeenCalledWith(eventName);
                });

                it('should navigate to \'itemId\' constuctor param + \'\/\' + courseId', function () {
                    navigationItem.navigate();
                    expect(router.navigate).toHaveBeenCalledWith(itemId + '/' + courseId);
                });
            });

            describe('navigationLink:', function () {
                it('should be computed', function () {
                    expect(navigationItem.navigationLink).toBeComputed();
                });

                it('should be \'#\' + \'itemId\' constuctor param + \'\/\' + courseId', function () {
                    expect(navigationItem.navigationLink()).toBe('#' + itemId + '/' + courseId);
                });
            });

            describe('isActive:', function () {
                it('should be computed', function () {
                    expect(navigationItem.isActive).toBeComputed();
                });

                describe('when module name is equal to \'itemId\' constructor param', function () {
                    it('should be true', function () {
                        router.routeData({
                            courseId: courseId,
                            moduleName: itemId
                        });
                        
                        expect(navigationItem.isActive()).toBeTruthy();
                    });
                });

                describe('when module name is not equal to \'itemId\' constructor param', function () {
                    it('should be false', function () {
                        router.routeData({
                            courseId: courseId,
                            moduleName: moduleName
                        });
                        expect(navigationItem.isActive()).toBeFalsy();
                    });
                });
            });

            describe('isRootView:', function () {
                it('should be computed', function () {
                    expect(navigationItem.isRootView).toBeComputed();
                });

                describe('when module name is equal to \'itemId\' constructor param', function () {
                    it('should be true', function () {
                        router.routeData({
                            courseId: courseId,
                            moduleName: itemId
                        });
                        expect(navigationItem.isRootView()).toBeTruthy();
                    });
                });

                describe('when module name is not equal to \'itemId\' constructor param', function () {
                    it('should be false', function () {
                        router.routeData({
                            courseId: courseId,
                            moduleName: moduleName
                        });
                        expect(navigationItem.isRootView()).toBeFalsy();
                    });
                });
            });

        });
    });