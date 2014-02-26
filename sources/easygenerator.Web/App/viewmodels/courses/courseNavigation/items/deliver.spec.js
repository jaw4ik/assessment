define(['viewmodels/courses/courseNavigation/items/deliver', 'eventTracker', 'plugins/router', 'routing/routingContext'],
    function (DesignNavigationItemViewModel, eventsTracker, router, routingContext) {

        describe('viewmodel [deliverNavigationItem]', function () {

            it('should be defined', function () {
                expect(DesignNavigationItemViewModel).toBeDefined();
            });

            var navigationItem,
                courseId = 'id';

            beforeEach(function () {
                navigationItem = new DesignNavigationItemViewModel();
                routingContext.courseId(courseId);
            });

            describe('navigationLink:', function () {
                it('should be defined', function () {
                    expect(navigationItem.navigationLink).toBeDefined();
                });

                it('should be \'#deliver/\' + courseId', function () {
                    expect(navigationItem.navigationLink).toBe('#deliver/' + courseId);
                });
            });

            describe('title:', function () {
                it('should be defined', function () {
                    expect(navigationItem.title).toBeDefined();
                });

                it('should be \'courseDeliver\'', function () {
                    expect(navigationItem.title).toBe('courseDeliver');
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

                it('should publish event\'Navigate to deliver course\'', function () {
                    navigationItem.navigate();
                    expect(eventsTracker.publish).toHaveBeenCalledWith('Navigate to deliver course');
                });

                it('should navigate to \'deliver/\' + courseId', function () {
                    navigationItem.navigate();
                    expect(router.navigate).toHaveBeenCalledWith('deliver/' + courseId);
                });
            });

            describe('isActive:', function () {
                it('should be computed', function () {
                    expect(navigationItem.isActive).toBeComputed();
                });

                describe('when module name is deliver', function () {
                    beforeEach(function () {
                        routingContext.moduleName('deliver');
                    });

                    it('should be true', function () {
                        expect(navigationItem.isActive()).toBeTruthy();
                    });
                });

                describe('when module name is not deliver', function () {
                    beforeEach(function () {
                        routingContext.moduleName('');
                    });

                    it('should be false', function () {
                        expect(navigationItem.isActive()).toBeFalsy();
                    });
                });
            });

            describe('isRootView:', function () {
                it('should be computed', function () {
                    expect(navigationItem.isRootView).toBeComputed();
                });

                describe('when module name is deliver', function () {
                    beforeEach(function () {
                        routingContext.moduleName('deliver');
                    });

                    it('should be true', function () {
                        expect(navigationItem.isRootView()).toBeTruthy();
                    });
                });

                describe('when module name is not deliver', function () {
                    beforeEach(function () {
                        routingContext.moduleName('');
                    });

                    it('should be false', function () {
                        expect(navigationItem.isRootView()).toBeFalsy();
                    });
                });
            });

        });
    });