define(['xApi/activityProvider', './requestManager'],
    function (viewModel, requestManager) {
        "use strict";
        var app = require('durandal/app');
        
        describe('viewModel [activityProvider]', function () {

            it('should be defined', function() {
                expect(viewModel).toBeDefined();
            });

            describe('init:', function () {

                it('should be function', function() {
                    expect(viewModel.init).toBeFunction();
                });

                it('should return promise', function() {
                    expect(viewModel.init()).toBePromise();
                });

            });

            describe('createActor:', function () {

                it('should be function', function() {
                    expect(viewModel.createActor).toBeFunction();
                });

                it('should return Actor', function() {
                    var result = viewModel.createActor('SomeName', 'fake@gmail.com');

                    expect(result.name).toBe('SomeName');
                    expect(result.mbox).toBe('mailto:fake@gmail.com');
                });

            });

            describe('turnOffSubscriptions:', function () {
                var promise;
                
                beforeEach(function() {
                    spyOn(requestManager, 'sendStatement');
                    promise = viewModel.init({name: 'actor'}, 'activity', 'url');
                });

                it('should be function', function () {
                    expect(viewModel.turnOffSubscriptions).toBeFunction();
                });

                it('should not send request to LRS when trigger "courseStarted"', function () {
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        viewModel.turnOffSubscriptions();
                        app.trigger("courseStarted");
                        
                        expect(requestManager.sendStatement).not.toHaveBeenCalled();
                    });
                });

                it('should not send request to LRS when trigger "courseFinished"', function () {
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        viewModel.turnOffSubscriptions();
                        app.trigger("courseFinished", { result: 1 });
                        
                        expect(requestManager.sendStatement).not.toHaveBeenCalled();
                    });
                });

                it('should not send request to LRS when trigger "questionSubmitted"', function () {
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        viewModel.turnOffSubscriptions();
                        app.trigger("questionSubmitted");
                        
                        expect(requestManager.sendStatement).not.toHaveBeenCalled();
                    });
                });
            });
        });
    }
);