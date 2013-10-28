define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/shell'),
        router = require('plugins/router'),
        context = require('context'),
        requestManager = require('xAPI/requestManager');

    describe('viewModel [shell]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function () {
            var deferred, promise;
            beforeEach(function () {
                deferred = $.Deferred();
                spyOn(context, 'initialize').andReturn(deferred.promise());
                spyOn(requestManager, 'init');
                promise = viewModel.activate();
                deferred.resolve();
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
                    expect(requestManager.init).toHaveBeenCalled();
                    expect(router.replace).toBeFunction();
                });
            });

            it('should initialize xAPI', function () {
                expect(router.replace).toBeFunction();
            });

        });

        describe('router:', function () {
            it('should be defined', function () {
                expect(router).toBeDefined();
            });
        });

    });
});