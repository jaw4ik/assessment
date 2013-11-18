define(['./activityManager', 'eventManager', './routingManager', './requestManager', './activityProvider'],
    function (activityManager, eventManager, routingManager, requestManager, activityProvider) {

        "use strict";

        describe('viewModel [activityManager]', function() {

            it('should be defined', function() {
                expect(activityManager).toBeDefined();
            });

            var requestManagerDefer, activityProviderDefer;
            beforeEach(function () {
                requestManagerDefer = Q.defer();
                spyOn(requestManager, 'init').andReturn(requestManagerDefer.promise);

                activityProviderDefer = Q.defer();
                spyOn(activityProvider, 'init').andReturn(activityProviderDefer.promise);
            });

            describe('init:', function () {

                it('should be function', function() {
                    expect(activityManager.init).toBeFunction();
                });

                it('should return promise', function() {
                    expect(activityManager.init()).toBePromise();
                });

                it('should init requestManager', function () {
                    var promise = activityManager.init();
                    
                    requestManagerDefer.resolve();
                    activityProviderDefer.resolve();

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(requestManager.init).toHaveBeenCalled();
                    });
                });

                it('should init activityProvider', function() {
                    var promise = activityManager.init();
                    
                    requestManagerDefer.resolve();
                    activityProviderDefer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(activityProvider.init).toHaveBeenCalled();
                    });
                });

                it('should set isInitialized to true', function () {
                    var promise = activityManager.init();

                    requestManagerDefer.resolve();
                    activityProviderDefer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(activityManager.getInitStatus()).toBeTruthy();
                    });
                });

            });

            describe('initialize:', function () {

                it('should be function', function() {
                    expect(activityManager.initialize).toBeFunction();
                });

                it('should return promise', function() {
                    expect(activityManager.initialize()).toBePromise();
                });

                it('should call routingNanager.mapRoute method', function() {
                    spyOn(routingManager, 'mapRoutes');
                    
                    var promise = activityManager.initialize();
                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(routingManager.mapRoutes).toHaveBeenCalled();
                    });
                });

            });

            describe('turnOff:', function () {

                it('should be function', function () {
                    expect(activityManager.turnOff).toBeFunction();
                });

                it('should turn all events off', function () {
                    spyOn(eventManager, 'turnAllEventsOff');
                    activityManager.turnOff();
                    expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                });

                it('should remove routes', function () {
                    spyOn(routingManager, 'removeRoutes');
                    activityManager.turnOff();
                    expect(routingManager.removeRoutes).toHaveBeenCalled();
                });

                it('should set init status to false', function() {
                    activityManager.turnOff();
                    expect(activityManager.getInitStatus()).toBeFalsy();
                });

            });

            describe('getInitStatus:', function() {

                it('should be function', function() {
                    expect(activityManager.getInitStatus).toBeFunction();
                });

                describe('when activityManager not initialized', function() {

                    it('should return false', function () {
                        activityManager.turnOff();
                        expect(activityManager.getInitStatus()).toBeFalsy();
                    });

                });

                describe('when activityManager is initialized', function () {

                    it('should return true', function() {
                        var promise = activityManager.init();

                        requestManagerDefer.resolve();
                        activityProviderDefer.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(activityManager.getInitStatus()).toBeTruthy();
                        });
                    });

                });

            });

        });

    }
);