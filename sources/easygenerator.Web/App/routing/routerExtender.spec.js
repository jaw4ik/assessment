define(['plugins/router'], function (router) {
    "use strict";

    describe('[routerExtender]', function () {

        describe('execute:', function () {

            describe('setDefaultLocationHash:', function () {
                var locationHash = '';

                beforeEach(function () {
                    locationHash = '';
                    spyOn(router, "setLocationHash").and.callFake(function (data) {
                        return locationHash = data;
                    });
                });

                it('should be function', function () {
                    expect(router.setDefaultLocationHash).toBeFunction();
                });

                describe('when window.location.hash exists', function () {
             
                    describe('when window.location.hash equals "#404"', function () {

                        describe('when hash exists in localStorage', function () {

                            beforeEach(function () {
                                spyOn(router, "getLocationHash").and.returnValue('#404');
                            });

                            it('should redirect user to root', function () {
                                expect(router.setDefaultLocationHash({ hash : '#objectives' })).toBe('courses');
                            });

                        });

                        describe('when hash not exists in localStorage', function () {

                            beforeEach(function () {
                                spyOn(router, "getLocationHash").and.returnValue('#404');
                            });

                            it('should redirect user to root', function () {
                                expect(router.setDefaultLocationHash(false)).toBe('courses');
                            });

                        });
                       
                    });

                    describe('when window.location.hash not equals "#404"', function () {

                        beforeEach(function () {
                            spyOn(router, "getLocationHash").and.returnValue('#test');
                        });

                        it('should redirect to hash from url', function () {
                            expect(router.setDefaultLocationHash({ hash: '#objectives' })).toBe('#test');
                            expect(router.setDefaultLocationHash(false)).toBe('#test');
                        });

                    });

                });

                describe('when window.location.hash not exists', function () {

                    beforeEach(function () {
                        spyOn(router, "getLocationHash").and.returnValue('');
                    });

                    describe('when hash exists in localStorage', function () {

                        describe('when hash equals "#404"', function () {
                            
                            it('should redirect user to root', function () {
                                expect(router.setDefaultLocationHash({hash : '#404'})).toBe('courses')
                            });

                        });

                        describe('when hash not equals "#404"', function () {
  
                            it('should redirect user to last visited page', function () {
                                expect(router.setDefaultLocationHash({ hash: '#test' })).toBe('#test')
                            });

                        });

                    });

                    describe('when hash not exists in localStorage', function () {

                        it('should be empty', function () {
                            expect(router.setDefaultLocationHash(false)).toBe('');
                        });

                    });

                });

            });

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
});