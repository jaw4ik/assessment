define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/shell'),
        router = require('durandal/plugins/router'),
        context = require('context');

    describe('viewModel [shell]', function () {
        
        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate', function () {
            var deferred;
            beforeEach(function () {
                deferred = $.Deferred();
                spyOn(context, 'initialize').andReturn(deferred.promise());
            });
            
            it('should be function', function() {
                expect(viewModel.activate).toBeFunction();
            });

            it('should be router.useConvention called', function () {
                spyOn(router, 'useConvention'),
                viewModel.activate();
                expect(router.useConvention).toHaveBeenCalled();
            });
            
            it('should be router.map called', function () {
                spyOn(router, 'map');
                viewModel.activate();
                expect(router.map).toHaveBeenCalled();
            });

            it('should be called method context.initialize', function() {
                viewModel.activate();
                expect(context.initialize).toHaveBeenCalled();
            });

        });
        describe('router', function () {
            it('should be defined', function () {
                expect(router).toBeDefined();
            });
        });
    });
});