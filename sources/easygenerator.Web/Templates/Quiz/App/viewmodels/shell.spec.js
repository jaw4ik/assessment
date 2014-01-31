define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/shell'),
        router = require('plugins/router'),
        context = require('context'),
        modulesInitializer = require('modulesInitializer');

    describe('viewModel [shell]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function () {
            var deferred, promise, moduleDefer;
            beforeEach(function () {
                context.logoUrl = 'someUrl';
                deferred = $.Deferred();
                moduleDefer = Q.defer();
                spyOn(context, 'initialize').andReturn(deferred.promise());
                spyOn(modulesInitializer, 'init').andReturn(moduleDefer.promise);
                promise = viewModel.activate();
                deferred.resolve();
                moduleDefer.resolve();
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should be called method context.initialize', function () {
                viewModel.activate();
                expect(context.initialize).toHaveBeenCalled();
            });

            it('should initialize xAPI', function () {
                waitsFor(function () {
                    return promise.state() != 'pending';
                });
                runs(function () {
                    expect(modulesInitializer.init).toHaveBeenCalled();
                    expect(router.replace).toBeFunction();
                });
            });

            it('should initialize xAPI', function () {
                expect(router.replace).toBeFunction();
            });

            it('should set logoUrl', function () {
                waitsFor(function () {
                    return promise.state() != 'pending';
                });
                runs(function () {
                    expect(viewModel.logoUrl).toBe(context.logoUrl;);
                });
            });

        });

        describe('router:', function () {
            it('should be defined', function () {
                expect(router).toBeDefined();
            });
        });

        describe('logoUrl', function() {

            it('should be defined', function() {
                expect(viewModel.logoUrl).toBeDefined();
            });

        });

    });
});