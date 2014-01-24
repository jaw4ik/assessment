define(['scormInitializer', 'APIWrapper'],
    function (scormInitializer, apiWrapper) {
        "use strict";
        var app = require('durandal/app');

        describe('viewModel [scormInitializer]', function () {

            it('should be defined', function () {
                expect(scormInitializer).toBeDefined();
            });
            
            describe('initialize:', function () {

                it('should be function', function () {
                    expect(scormInitializer.initialize).toBeFunction();
                });

                it('should return promise', function () {
                    expect(scormInitializer.initialize()).toBePromise();
                });

                it('should call apiWrapper doLMSInitialize method', function () {
                    spyOn(apiWrapper, 'doLMSInitialize');

                    var promise = scormInitializer.initialize();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(apiWrapper.doLMSInitialize).toHaveBeenCalled();
                    });
                });

                describe('when apiWrapper is initialized successfully', function () {
                    beforeEach(function () {
                        spyOn(apiWrapper, 'doLMSInitialize').andReturn("true");
                        spyOn(apiWrapper, 'doLMSSetValue');
                        spyOn(apiWrapper, 'doLMSCommit');
                    });
                    
                    describe('when triggered "courseFinished"', function () {
                        beforeEach(function () {
                            app.off("courseFinished");
                        });

                        it('should send overall progress to LMS', function () {
                            var promise = scormInitializer.initialize();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                app.trigger("courseFinished", { result: 0.5 });
                                expect(apiWrapper.doLMSSetValue).toHaveBeenCalledWith("cmi.core.score.min", "0");
                                expect(apiWrapper.doLMSSetValue).toHaveBeenCalledWith("cmi.core.score.max", "100");
                                expect(apiWrapper.doLMSSetValue).toHaveBeenCalledWith("cmi.core.score.raw", 50);
                            });
                        });

                        it('should send doLMSCommit to LMS', function () {
                            var promise = scormInitializer.initialize();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                app.trigger("courseFinished", { result: 1 });
                                expect(apiWrapper.doLMSCommit).toHaveBeenCalled();
                            });
                        });
                    });
                });

                describe('when apiWrapper initialization is failed', function () {

                    beforeEach(function () {
                        spyOn(apiWrapper, 'doLMSInitialize').andReturn("false");
                        spyOn(apiWrapper, 'doLMSSetValue');
                        spyOn(apiWrapper, 'doLMSCommit');
                    });

                    describe('when triggered "courseFinished"', function () {
                        beforeEach(function() {
                            app.off("courseFinished");
                        });

                        it('should not send overall progress to LMS', function () {
                            var promise = scormInitializer.initialize();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                app.trigger("courseFinished", { result: 0.5 });
                                expect(apiWrapper.doLMSSetValue).not.toHaveBeenCalled();
                            });
                        });

                        it('should not send doLMSCommit to LMS', function () {
                            var promise = scormInitializer.initialize();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                app.trigger("courseFinished", { result: 1 });
                                expect(apiWrapper.doLMSCommit).not.toHaveBeenCalled();
                            });
                        });
                    });
                });
            });
        });
    });

