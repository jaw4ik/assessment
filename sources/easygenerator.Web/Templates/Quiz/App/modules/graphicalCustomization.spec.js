define(function (require) {
    "use strict";

    var module = require('modules/graphicalCustomization'),
        context = require('context');

    describe('module [graphicalCustomization]', function () {

        var logoUrl;

        beforeEach(function () {
            logoUrl = 'some logo url';
            context.logoUrl = logoUrl;
        });

        it('should be defined', function () {
            expect(module).toBeDefined();
        });

        describe('initialize:', function () {

            it('should be function', function () {
                expect(module.initialize).toBeFunction();
            });

            it('should return promise', function () {
                expect(module.initialize()).toBePromise();
            });

            describe('when settings has empty url', function () {

                it('should not update logoUrl in context', function () {
                    var settings = {
                        url: ''
                    };
                    var promise = module.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(context.logoUrl).toBe(logoUrl);
                    });
                });

            });

            describe('when settings has url', function () {

                it('should update logoUrl in context', function () {
                    var newUrl = 'new logo url';
                    var settings = {
                        url: newUrl
                    };
                    var promise = module.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(context.logoUrl).toBe(newUrl);
                    });
                });

            });

        });

    });
});