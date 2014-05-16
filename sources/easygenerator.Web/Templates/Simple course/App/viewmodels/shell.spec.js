define(['viewModels/shell'], function (viewModel) {
    "use strict";

    var
        context = require('context'),
        router = require('plugins/router'),
        modulesInitializer = require('modulesInitializer'),
        templateSettings = require('modules/templateSettings'),
        themesInjector = require('themesInjector'),
        app = require('durandal/app');

    describe('viewModel [shell]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('logoUrl:', function () {

            it('should be defined', function () {
                expect(viewModel.logoUrl).toBeDefined();
            });

        });

        describe('isNavigatingToAnotherView:', function () {
            it('should be defined observable', function () {
                expect(viewModel.isNavigatingToAnotherView).toBeObservable();
            });
        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            var routerActivateDefer, contextInititalizeDefer, modulesInitializerDefer, themesInjectorDefer;
            beforeEach(function () {
                routerActivateDefer = Q.defer();
                spyOn(router, 'activate').andReturn(routerActivateDefer.promise);
                routerActivateDefer.resolve();

                contextInititalizeDefer = Q.defer();
                spyOn(context, 'initialize').andReturn(contextInititalizeDefer.promise);
                contextInititalizeDefer.resolve({ course: { title: 'Course title' } });

                modulesInitializerDefer = Q.defer();
                spyOn(modulesInitializer, 'init').andReturn(modulesInitializerDefer.promise);

                themesInjectorDefer = Q.defer();
                spyOn(themesInjector, 'init').andReturn(themesInjectorDefer.promise);
                themesInjectorDefer.resolve();
            });
            
            it('should initialize modules', function () {
                viewModel.activate();
                expect(modulesInitializer.init).toHaveBeenCalled();
            });

            describe('and when modules initialized', function () {
                beforeEach(function () {
                    modulesInitializerDefer.resolve();
                });

                it('should set logoUrl', function () {
                    templateSettings.logoUrl = 'some/url';
                    var promise = viewModel.activate();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.logoUrl()).toBe(templateSettings.logoUrl);
                    });
                });

                it('should initialize theme', function() {
                    var promise = viewModel.activate();

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(themesInjector.init).toHaveBeenCalled();
                    });
                });

                describe('and when theme initialized', function() {

                    it('should initialize context', function () {
                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(context.initialize).toHaveBeenCalled();
                        });
                    });

                    describe('and when context initialized', function () {

                        it('should set application title', function () {
                            var promise = viewModel.activate();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(app.title).toBe('Course title');
                            });
                        });

                        it('should activate router', function () {
                            var promise = viewModel.activate();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(router.activate).toHaveBeenCalled();
                            });
                        });

                    });

                });

            });

        });

    });

});