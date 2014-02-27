define(['viewmodels/courses/courseNavigation/items/develop', 'eventTracker', 'plugins/router', 'routing/routingContext'],
    function (DevelopNavigationItemViewModel, eventsTracker, router, routingContext) {

        describe('viewmodel [defineNavigationItem]', function () {

            it('should be defined', function () {
                expect(DevelopNavigationItemViewModel).toBeDefined();
            });

            var navigationItem,
                courseId = 'id';

            beforeEach(function() {
                navigationItem = new DevelopNavigationItemViewModel();
                routingContext.courseId(courseId);
            });

            describe('navigationLink:', function () {
                it('should be defined', function () {
                    expect(navigationItem.navigationLink).toBeDefined();
                });

                it('should be \'#course/\' + courseId', function () {
                    expect(navigationItem.navigationLink()).toBe('#course/' + courseId);
                });
            });

            describe('title:', function () {
                it('should be defined', function () {
                    expect(navigationItem.title).toBeDefined();
                });

                it('should be \'courseDefine\'', function () {
                    expect(navigationItem.title).toBe('courseDefine');
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

                it('should publish event\'Navigate to develop course\'', function () {
                    navigationItem.navigate();
                    expect(eventsTracker.publish).toHaveBeenCalledWith('Navigate to develop course');
                });

                it('should navigate to \'course/\' + courseId', function () {
                    navigationItem.navigate();
                    expect(router.navigate).toHaveBeenCalledWith('course/' + courseId);
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

                    it('should be false', function () {
                        expect(navigationItem.isActive()).toBeFalsy();
                    });
                });

                describe('when module name is deliver', function () {
                    beforeEach(function () {
                        routingContext.moduleName('deliver');
                    });

                    it('should be false', function () {
                        expect(navigationItem.isActive()).toBeFalsy();
                    });
                });

                describe('when module name is not design and not deliver', function () {
                    beforeEach(function () {
                        routingContext.moduleName('');
                    });

                    it('should be true', function () {
                        expect(navigationItem.isActive()).toBeTruthy();
                    });
                });
            });

            describe('isRootView:', function () {
                it('should be computed', function () {
                    expect(navigationItem.isRootView).toBeComputed();
                });

                describe('when module name is course', function () {
                    beforeEach(function () {
                        routingContext.moduleName('course');
                    });

                    it('should be true', function () {
                        expect(navigationItem.isRootView()).toBeTruthy();
                    });
                });

                describe('when module name is not course', function () {
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