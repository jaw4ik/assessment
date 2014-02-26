define(['viewmodels/courses/courseNavigation/items/design', 'eventTracker', 'plugins/router', 'routing/routingContext'],
    function (DesignNavigationItemViewModel, eventsTracker, router, routingContext) {

        describe('viewmodel [designNavigationItem]', function () {

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

                it('should be \'#design/\' + courseId', function () {
                    expect(navigationItem.navigationLink).toBe('#design/' + courseId);
                });
            });

            describe('title:', function () {
                it('should be defined', function () {
                    expect(navigationItem.title).toBeDefined();
                });

                it('should be \'courseDefine\'', function () {
                    expect(navigationItem.title).toBe('courseDesign');
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

                it('should publish event\'Navigate to define course\'', function () {
                    navigationItem.navigate();
                    expect(eventsTracker.publish).toHaveBeenCalledWith('Navigate to design course');
                });

                it('should navigate to \'design/\' + courseId', function () {
                    navigationItem.navigate();
                    expect(router.navigate).toHaveBeenCalledWith('design/' + courseId);
                });
            });

            describe('isActive:', function () {
                it('should be computed', function () {
                    expect(navigationItem.isActive).toBeComputed();
                });

                describe('when module name is design', function () {
                    beforeEach(function () {
                        routingContext.moduleName('design');
                    });

                    it('should be true', function () {
                        expect(navigationItem.isActive()).toBeTruthy();
                    });
                });

                describe('when module name is not design', function () {
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

                describe('when module name is design', function () {
                    beforeEach(function () {
                        routingContext.moduleName('design');
                    });

                    it('should be true', function () {
                        expect(navigationItem.isRootView()).toBeTruthy();
                    });
                });

                describe('when module name is not design', function () {
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