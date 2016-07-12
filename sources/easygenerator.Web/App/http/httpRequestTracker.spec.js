import requestTracker from './httpRequestTracker';
import _ from 'underscore';
import app from 'durandal/app';

describe('[httpRequestTracker]', () => {
    describe('isRequestPending:', () => {
        describe('when request count > 0', () => {
            beforeEach(() => {
                requestTracker.requestCount = 5;
            });

            it('should be true', () => {
                expect(requestTracker.isRequestPending()).toBeTruthy();
            });
        });

        describe('when request count = 0', () => {
            beforeEach(() => {
                requestTracker.requestCount = 0;
            });

            it('should be false', () => {
                expect(requestTracker.isRequestPending()).toBeFalsy();
            });
        });
    });

    describe('waitForRequestFinalization:', () => {
        describe('when request count = 0', () => {
            beforeEach(() => {
                requestTracker.requestCount = 0;
            });

            it('should resolve promise', done => {
                var promise = requestTracker.waitForRequestFinalization();

                promise.then(() => {
                    expect(true).toBeTruthy();
                    done();
                }).catch(() => {
                    expect(false).toBeTruthy();
                    done();
                });
            });
        });

        describe('when request count > 0', () => {
            beforeEach(() => {
                requestTracker.requestCount = 5;
            });

            it('should subscribe on httpRequestTracker:requestsFinalized event', done => {
                spyOn(requestTracker, 'on').and.callThrough();
                var promise = requestTracker.waitForRequestFinalization();

                requestTracker.trigger('httpRequestTracker:requestsFinalized');

                promise.then(() => {
                    expect(requestTracker.on).toHaveBeenCalledWith('httpRequestTracker:requestsFinalized');
                    done();
                }).catch(() => {
                    expect(false).toBeTruthy();
                    done();
                });
            });

            describe('and when requests finalized', () => {
                let subscriptionResult = {
                    off: jasmine.createSpy()
                },
                      subscription = {
                          then: function(handler) {
                              _.defer(() => {
                                  handler.call(requestTracker);
                              });

                              return subscriptionResult;
                          }
                      };
                
                beforeEach(() => {
                    spyOn(requestTracker, 'on').and.returnValue(subscription);
                });

                it('should resolve promise', done => {
                    var promise = requestTracker.waitForRequestFinalization();

                    requestTracker.trigger('httpRequestTracker:requestsFinalized');

                    promise.then(() => {
                        expect(true).toBeTruthy();
                        done();
                    }).catch(() => {
                        expect(false).toBeTruthy();
                        done();
                    });
                });

                it('should cancel the subscription', done => {
                    var promise = requestTracker.waitForRequestFinalization();

                    requestTracker.trigger('httpRequestTracker:requestsFinalized');

                    promise.then(() => {
                        expect(subscriptionResult.off).toHaveBeenCalled();
                        done();
                    }).catch(() => {
                        expect(false).toBeTruthy();
                        done();
                    });
                });
            });
          
        });
    });

    describe('startTracking:', () => {
        beforeEach(() => {
            spyOn(app, 'on').and.returnValue({
                then:function(){}
            });
        });

        it('should subscribe on apiHttpWrapper:post-begin event', () => {
            requestTracker.startTracking();
            expect(app.on).toHaveBeenCalledWith('apiHttpWrapper:post-begin');
        });

        it('should subscribe on authHttpWrapper:post-begin event', () => {
            requestTracker.startTracking();
            expect(app.on).toHaveBeenCalledWith('authHttpWrapper:post-begin');
        });

        it('should subscribe on storageHttpWrapper:post-begin event', () => {
            requestTracker.startTracking();
            expect(app.on).toHaveBeenCalledWith('storageHttpWrapper:post-begin');
        });

        it('should subscribe on storageHttpWrapper:get-begin event', () => {
            requestTracker.startTracking();
            expect(app.on).toHaveBeenCalledWith('storageHttpWrapper:get-begin');
        });

        it('should subscribe on apiHttpWrapper:post-end event', () => {
            requestTracker.startTracking();
            expect(app.on).toHaveBeenCalledWith('apiHttpWrapper:post-end');
        });

        it('should subscribe on authHttpWrapper:post-end event', () => {
            requestTracker.startTracking();
            expect(app.on).toHaveBeenCalledWith('authHttpWrapper:post-end');
        });

        it('should subscribe on storageHttpWrapper:post-end event', () => {
            requestTracker.startTracking();
            expect(app.on).toHaveBeenCalledWith('storageHttpWrapper:post-end');
        });

        it('should subscribe on storageHttpWrapper:get-end event', () => {
            requestTracker.startTracking();
            expect(app.on).toHaveBeenCalledWith('storageHttpWrapper:get-end');
        });
    });
});