define(['plugins/router'], function (router) {
    describe('[routerExtender]', function () {

        describe('should extend router with routeData', function () {

            describe('[routeData]:', function () {

                it('should be observable', function () {
                    expect(router.routeData).toBeObservable();
                });

                it('should be equal to default routeData object', function () {
                    expect(router.routeData().courseId).toBeNull();
                    expect(router.routeData().moduleName).toBeNull();
                });

                describe('when router does not have active instruction', function () {
                    beforeEach(function () {
                        router.activeInstruction(null);
                    });

                    it('should be equal to default routeData object', function () {
                        expect(router.routeData().courseId).toBeNull();
                        expect(router.routeData().moduleName).toBeNull();
                    });
                });

                describe('when router has active instruction', function () {
                    describe('and when active instruction config is not defined', function () {
                        it('should be equal to default routeData object', function () {
                            expect(router.routeData().courseId).toBeNull();
                            expect(router.routeData().moduleName).toBeNull();
                        });
                    });

                    var moduleId = 'modulePath/moduleName';

                    describe('and when active instruction config is defined', function () {
                        beforeEach(function () {
                            router.activeInstruction({
                                config: {
                                    moduleId: moduleId,
                                    route: 'url/:param1/somePath/:param2',
                                },
                                params: ['value1', 'value2'],
                                queryParams: { queryParam1: 'queryParam1', queryParam2: 'queryParam2' }
                            });
                        });

                        it('should return module name', function () {
                            expect(router.routeData().moduleName).toBe('moduleName');
                        });

                        it('should be filled with parsed params from route', function () {
                            expect(router.routeData().param1).toBe('value1');
                            expect(router.routeData().param2).toBe('value2');
                        });

                        it('should be merged with instruction query params', function () {
                            expect(router.routeData().queryParam1).toBe('queryParam1');
                            expect(router.routeData().queryParam2).toBe('queryParam2');
                        });
                    });
                });
            });
        });
    });
});