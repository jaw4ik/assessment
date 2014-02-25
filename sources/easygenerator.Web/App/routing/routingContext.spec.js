define(['routing/routingContext', 'plugins/router'], function (routingContext, router) {
    "use strict";

    describe('[routingContext]', function () {

        describe('moduleId:', function () {

            it('should be observable', function () {
                expect(routingContext.moduleId).toBeObservable();
            });

            describe('when router does not have active instruction', function () {
                beforeEach(function () {
                    router.activeInstruction(null);
                });

                it('should be null', function () {
                    expect(routingContext.moduleId()).toBe(null);
                });
            });

            describe('when router has active instruction', function () {
                var moduleId = 'moduleId';
                describe('and when active instruction config is defined', function () {
                    beforeEach(function () {
                        router.activeInstruction({
                            config: {
                                moduleId: moduleId
                            }
                        });
                    });

                    it('should return module id', function () {
                        expect(routingContext.moduleId()).toBe(moduleId);
                    });
                });

                describe('and when active instruction config is not defined', function () {
                    beforeEach(function () {
                        router.activeInstruction({
                            config: null
                        });
                    });

                    it('should be null', function () {
                        expect(routingContext.moduleId()).toBe(null);
                    });
                });

            });

        });

        describe('moduleName:', function () {

            it('should be observable', function () {
                expect(routingContext.moduleName).toBeObservable();
            });

            describe('when router does not have active instruction', function () {
                beforeEach(function () {
                    router.activeInstruction(null);
                });

                it('should be null', function () {
                    expect(routingContext.moduleName()).toBe(null);
                });
            });

            describe('when router has active instruction', function () {
                var moduleName = 'moduleName';
                var moduleId = 'path/' + moduleName;
                describe('and when active instruction config is defined', function () {
                    beforeEach(function () {
                        router.activeInstruction({
                            config: {
                                moduleId: moduleId
                            }
                        });
                    });

                    it('should return module name', function () {
                        expect(routingContext.moduleName()).toBe(moduleName);
                    });
                });

                describe('and when active instruction config is not defined', function () {
                    beforeEach(function () {
                        router.activeInstruction({
                            config: null
                        });
                    });

                    it('should be null', function () {
                        expect(routingContext.moduleName()).toBe(null);
                    });
                });

            });

        });

        describe('courseId:', function () {
            var courseId = 'courseId';
            it('should be observable', function () {
                expect(routingContext.courseId).toBeObservable();
            });

            describe('when router has active instruction', function () {
                describe('and active moduleId is \'viewmodels/courses/course\'', function () {

                    describe('and activeInstruction has params', function () {
                        beforeEach(function () {
                            router.activeInstruction({
                                config: {
                                    moduleId: 'viewmodels/courses/course'
                                },
                                params: [courseId]
                            });
                        });

                        it('should be first param value', function () {
                            expect(routingContext.courseId()).toBe(courseId);
                        });
                    });

                    describe('and activeInstruction does not have any params', function () {
                        beforeEach(function () {
                            router.activeInstruction({
                                config: {
                                    moduleId: 'viewmodels/courses/course'
                                },
                                params: []
                            });
                        });

                        it('should be null', function () {
                            expect(routingContext.courseId()).toBe(null);
                        });
                    });

                });

                describe('and active moduleId is \'viewmodels/courses/design\'', function () {

                    describe('and activeInstruction has params', function () {
                        beforeEach(function () {
                            router.activeInstruction({
                                config: {
                                    moduleId: 'viewmodels/courses/design'
                                },
                                params: [courseId]
                            });
                        });

                        it('should be first param value', function () {
                            expect(routingContext.courseId()).toBe(courseId);
                        });
                    });

                    describe('and activeInstruction does not have any params', function () {
                        beforeEach(function () {
                            router.activeInstruction({
                                config: {
                                    moduleId: 'viewmodels/courses/design'
                                },
                                params: []
                            });
                        });

                        it('should be null', function () {
                            expect(routingContext.courseId()).toBe(null);
                        });
                    });

                });

                describe('and active moduleId is \'viewmodels/courses/deliver\'', function () {

                    describe('and activeInstruction has params', function () {
                        beforeEach(function () {
                            router.activeInstruction({
                                config: {
                                    moduleId: 'viewmodels/courses/deliver'
                                },
                                params: [courseId]
                            });
                        });

                        it('should be first param value', function () {
                            expect(routingContext.courseId()).toBe(courseId);
                        });
                    });

                    describe('and activeInstruction does not have any params', function () {
                        beforeEach(function () {
                            router.activeInstruction({
                                config: {
                                    moduleId: 'viewmodels/courses/deliver'
                                },
                                params: []
                            });
                        });

                        it('should be null', function () {
                            expect(routingContext.courseId()).toBe(null);
                        });
                    });

                });

                describe('and active moduleId is not course module', function () {

                    describe('and when activeInstruction has query params', function () {
                        describe('and when query param courseId is string', function () {
                            beforeEach(function () {
                                router.activeInstruction({
                                    config: {
                                        moduleId: 'viewmodels/courses/course2'
                                    },
                                    queryParams: { courseId: courseId }
                                });
                            });

                            it('should be query param courseId value', function () {
                                expect(routingContext.courseId()).toBe(courseId);
                            });
                        });

                        describe('and when query param courseId is not string', function () {
                            beforeEach(function () {
                                router.activeInstruction({
                                    config: {
                                        moduleId: 'viewmodels/courses/course2'
                                    },
                                    queryParams: {}
                                });
                            });

                            it('should be null', function () {
                                expect(routingContext.courseId()).toBe(null);
                            });
                        });

                    });

                    describe('and when activeInstruction does not have query params', function () {
                        beforeEach(function () {
                            router.activeInstruction({
                                config: {
                                    moduleId: 'viewmodels/courses/course2'
                                }
                            });
                        });

                        it('should be null', function () {
                            expect(routingContext.courseId()).toBe(null);
                        });
                    });

                });

            });

            describe('when router does not have active instruction', function () {
                beforeEach(function () {
                    router.activeInstruction(null);
                });

                it('should be null', function () {
                    expect(routingContext.courseId()).toBe(null);
                });
            });
        });
    });
});