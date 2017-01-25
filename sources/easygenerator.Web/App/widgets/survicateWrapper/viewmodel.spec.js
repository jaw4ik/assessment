import userContext from 'userContext';
import survicate from 'analytics/survicate/survicateLoader';
import survicateWrapper from 'widgets/survicateWrapper/viewmodel';
import constants from 'constants';

var survicateConstants = constants.analytics.survicate;

describe('widjet survicateWrapper', () => {

    describe('isShown:', () => {
        it('should be observable', () => {
            expect(survicateWrapper.isShown).toBeObservable();
        });
    });

    describe('constructor:', () => {
        it('should be function', () => {
            expect(survicateWrapper.constructor).toBeFunction();
        });
    });

    describe('isLoaded:', () => {
        it('should be observable', () => {
            expect(survicateWrapper.isLoaded).toBeObservable();
        });
    });

    describe('activate:', () => {

        let promise;

        beforeEach(() => {
            window._sv = {
                loaded: false,
                seen: false,
                subscribe: () => {}
            };

            promise = Promise.resolve();
            spyOn(survicate, 'load').and.returnValue(promise);
            spyOn(window._sv, 'subscribe');

            userContext.identity = {
                canShowSurvicate: true,
                email: 'test@test.com'
            }
        });

        it('should be function', () => {
            expect(survicateWrapper.activate).toBeFunction();
        });

        describe('when survicate can\'t be shown:', () => {
            beforeEach(() => {
                userContext.identity.canShowSurvicate = false;
            });

            it('should not call survicate init method', () => {
                survicateWrapper.activate();
                expect(survicate.load).not.toHaveBeenCalledWith(userContext.identity.email);
            });
        });

        describe('when survicate is can be shown:', () => {
            beforeEach(() => {
                userContext.identity.canShowSurvicate = true;
                jasmine.clock().uninstall();
                jasmine.clock().install();
            });

            afterEach(() => {
                jasmine.clock().uninstall();
            });

            it('should call survicate init method', () => {
                survicateWrapper.activate();
                expect(survicate.load).toHaveBeenCalledWith(userContext.identity.email);
            });

            describe('if _sv not loaded', () => {
                beforeEach(() => {
                    window._sv.loaded = false;
                });

                it('should not call _sv.subscribe', () => {
                    jasmine.clock().tick(300);
                    expect(window._sv.subscribe).not.toHaveBeenCalled();
                });
            });

            describe('if _sv not seen', () => {
                beforeEach(() => {
                    window._sv.seen = false;
                });

                it('should not call _sv.subscribe', () => {
                    jasmine.clock().tick(300);
                    expect(window._sv.subscribe).not.toHaveBeenCalled();
                });
            });

            describe('if _sv loaded and seen', () => {
                beforeEach(() => {
                    window._sv.loaded = true;
                    window._sv.seen = true;
                });
                
                describe('when survicate delay is enabled', () => {
                    beforeEach(() => {
                        window._sv.survey = {                            
                            appear_method: 'delayed',
                            display_delay: 5
                        };
                    });

                    describe('when delay time is reached', () => {
                        describe('should call _sv.subscribe with', () => {
                            it('closed event', () => {                        
                                survicateWrapper.activate();
                                jasmine.clock().tick(5300);
                                expect(window._sv.subscribe).toHaveBeenCalledWith('closed', jasmine.any(Function));
                            });

                            it('pointSubmit event', () => {                  
                                survicateWrapper.activate();
                                jasmine.clock().tick(5300);
                                expect(window._sv.subscribe).toHaveBeenCalledWith('pointSubmit', jasmine.any(Function));
                            });

                            it('pointRendered event', () => {                  
                                survicateWrapper.activate();
                                jasmine.clock().tick(5300);
                                expect(window._sv.subscribe).toHaveBeenCalledWith('pointSubmit', jasmine.any(Function));
                            });
                        });
                        
                        it('should set isLoaded to true', () => {                  
                            survicateWrapper.activate();
                            jasmine.clock().tick(5300);
                            expect(survicateWrapper.isLoaded()).toBeTruthy();
                        });

                        it('should set isShown to true', () => {                  
                            survicateWrapper.activate();
                            jasmine.clock().tick(5300);
                            expect(survicateWrapper.isShown()).toBeTruthy();
                        });
                    })

                    describe('when delay time is not reached', () => {
                        beforeEach(() => {
                            survicateWrapper.isLoaded(false);
                            survicateWrapper.isShown(false);
                        });

                        it('should not call _sv.subscribe', () => {                  
                            survicateWrapper.activate();
                            jasmine.clock().tick(300);
                            expect(window._sv.subscribe).not.toHaveBeenCalled();
                        });

                        it('should set isLoaded to true', () => {                  
                            survicateWrapper.activate();
                            jasmine.clock().tick(300);
                            expect(survicateWrapper.isLoaded()).not.toBeTruthy();
                        });

                        it('should set isShown to true', () => {                  
                            survicateWrapper.activate();
                            jasmine.clock().tick(300);
                            expect(survicateWrapper.isShown()).not.toBeTruthy();
                        });                    
                    });

                });
                
                describe('when survicate delay is disabled', () => {
                    beforeEach(() => {
                        window._sv.survey = {                            
                            appear_method: 'default',
                            display_delay: 0
                        };
                    });

                    describe('should call _sv.subscribe with', () => {
                        it('closed event', () => {                        
                            survicateWrapper.activate();
                            jasmine.clock().tick(300);
                            expect(window._sv.subscribe).toHaveBeenCalledWith('closed', jasmine.any(Function));
                        });

                        it('pointSubmit event', () => {                  
                            survicateWrapper.activate();
                            jasmine.clock().tick(300);
                            expect(window._sv.subscribe).toHaveBeenCalledWith('pointSubmit', jasmine.any(Function));
                        });

                        it('pointRendered event', () => {                  
                            survicateWrapper.activate();
                            jasmine.clock().tick(300);
                            expect(window._sv.subscribe).toHaveBeenCalledWith('pointSubmit', jasmine.any(Function));
                        });
                    });

                    it('should set isLoaded to true', () => {                  
                        survicateWrapper.activate();
                        jasmine.clock().tick(300);
                        expect(survicateWrapper.isLoaded()).toBeTruthy();
                    });

                    it('should set isShown to true', () => {                  
                        survicateWrapper.activate();
                        jasmine.clock().tick(300);
                        expect(survicateWrapper.isShown()).toBeTruthy();
                    });
                });
            });
        });
    });
});
