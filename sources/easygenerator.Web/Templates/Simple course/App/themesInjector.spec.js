define(['themesInjector'], function (themesInjector) {
    "use strict";

    describe('[themesInjector]', function () {

        it('should be defined', function () {
            expect(themesInjector).toBeDefined();
        });

        describe('init:', function () {

            it('should be function', function () {
                expect(themesInjector.init).toBeFunction();
            });

            it('should return promise', function () {
                expect(themesInjector.init()).toBePromise();
            });

            it('should create link for theme file', function () {
                spyOn(document, 'createElement').andCallFake(function () { });

                var promise = themesInjector.init();
                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(document.createElement).toHaveBeenCalledWith('link');
                });
            });

            it('should add link to document head', function () {
                spyOn(document.head, 'appendChild').andCallFake(function () { });

                var promise = themesInjector.init();
                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(document.head.appendChild).toHaveBeenCalled();
                });
            });

        });

    });

});