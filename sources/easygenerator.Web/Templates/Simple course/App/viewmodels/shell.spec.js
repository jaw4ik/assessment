define(['viewModels/shell'], function (viewModel) {
    "use strict";

    var
        context = require('context'),
        router = require('plugins/router'),
        modulesInitializer = require('modulesInitializer'),
        graphicalCustomization = require('modules/graphicalCustomization'),
        app = require('durandal/app');

    describe('viewModel [shell]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('logoUrl:', function() {

            it('should be defined', function() {
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

            var routerActivateDefer, contextInititalizeDefer;
            beforeEach(function () {
                routerActivateDefer = Q.defer();
                spyOn(router, 'activate').andReturn(routerActivateDefer.promise);
                routerActivateDefer.resolve();
                
                contextInititalizeDefer = Q.defer();
                spyOn(context, 'initialize').andReturn(contextInititalizeDefer.promise);
                contextInititalizeDefer.resolve({ course: { title: 'Course title' } });
            });

            it('should initialize context', function () {
                viewModel.activate();
                expect(context.initialize).toHaveBeenCalled();
            });

            describe('when context initialized', function () {

                var modulesInitializerDefer;
                beforeEach(function() {
                    modulesInitializerDefer = Q.defer();
                    spyOn(modulesInitializer, 'init').andReturn(modulesInitializerDefer.promise);
                    modulesInitializerDefer.resolve();
                });

                it('should set application title', function() {
                    var promise = viewModel.activate();

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(app.title).toBe('Course title');
                    });
                });

                it('should initialize modules', function() {
                    var promise = viewModel.activate();

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(modulesInitializer.init).toHaveBeenCalled();
                    });
                });

                describe('and when modules initialized', function() {

                    it('should set logoUrl', function () {
                        graphicalCustomization.settings.logoUrl = 'some/url';
                        var promise = viewModel.activate();

                        waitsFor(function() {
                            return !promise.isPending();
                        });
                        runs(function() {
                            expect(viewModel.logoUrl).toBe(graphicalCustomization.settings.logoUrl);
                        });
                    });

                    it('should activate router', function() {
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