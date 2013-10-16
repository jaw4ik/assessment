define(['repositories/helpHintRepository'],
    function (repository) {
        "use strict";

        var
            httpWrapper = require('httpWrapper'),
            dataContext = require('dataContext');

        describe('repository [helpHintRepository]', function () {

            var httpWrapperPostDeffered;

            beforeEach(function () {
                httpWrapperPostDeffered = Q.defer();
                spyOn(httpWrapper, 'post').andReturn(httpWrapperPostDeffered.promise);
            });
            
            it('should be object', function () {
                expect(repository).toBeObject();
            });

            describe('getCollection:', function () {

                it('should be function', function () {
                    expect(repository.getCollection).toBeFunction();
                });

                it('shoud return promise', function () {
                    expect(repository.getCollection()).toBePromise();
                });

                it('shoud return helpHints', function () {
                    var object = { id: 'someId', name: 'someName' };
                    dataContext.helpHints.push(object);

                    var promise = repository.getCollection();

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(promise).toBeResolvedWith(dataContext.helpHints);
                    });
                });
            });

            describe('removeHint:', function () {

                it('should be function', function() {
                    expect(repository.removeHint).toBeFunction();
                });

                it('should return promise', function () {
                    var result = repository.removeHint('be');
                    expect(result).toBePromise();
                });

                describe('when hintId is not a string', function() {

                    it('should reject promise', function() {
                        var promise = repository.removeHint(null);

                        waitsFor(function() {
                            return !promise.isPending();
                        });
                        runs(function() {
                            expect(promise).toBeRejectedWith('Hint id is not a string');
                        });
                    });

                });

                describe('when hintId is a string', function() {

                    it('should send request to server', function () {
                        var hintId = 'someId';
                        var promise = repository.removeHint(hintId);
                        httpWrapperPostDeffered.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/helpHint/hide', { hintId: hintId });
                        });
                        
                    });

                    describe('and request fails', function() {

                        it('should reject promise', function() {
                            var hintId = 'someId';
                            var promise = repository.removeHint(hintId);
                            
                            httpWrapperPostDeffered.reject('Some reason');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Some reason');
                            });
                        });

                    });

                    describe('and request successful', function() {

                        it('should remove hint from dataContext', function () {
                            var hintId = 'someId';

                            dataContext.helpHints = [{ id: hintId }];
                            var promise = repository.removeHint(hintId);

                            httpWrapperPostDeffered.resolve();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(dataContext.helpHints.length).toBe(0);
                            });
                        });

                    });
                    
                });

            });

            describe('addHint:', function () {

                it('should be function', function () {
                    expect(repository.addHint).toBeFunction();
                });

                it('should return promise', function () {
                    var result = repository.addHint('be');
                    expect(result).toBePromise();
                });

                describe('when hint key is not a string', function () {

                    it('should reject promise', function () {
                        var promise = repository.addHint(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Hint key is not a string');
                        });
                    });

                });

                describe('when hint key is a string', function () {
                    
                    it('should send request to server', function () {
                        var hintKey = 'someKey';
                        var promise = repository.addHint(hintKey);
                        httpWrapperPostDeffered.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(httpWrapper.post).toHaveBeenCalledWith('api/helpHint/show', { hintKey: hintKey });
                        });
                    });
                    
                    describe('and request fails', function () {

                        it('should reject promise', function () {
                            var hintKey = 'someKey';
                            var promise = repository.addHint(hintKey);

                            httpWrapperPostDeffered.reject('Some reason');

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('Some reason');
                            });
                        });

                    });

                    describe('and request successful', function () {

                        describe('and response doesn`t have Id', function() {

                            it('should reject promise', function() {
                                var hintKey = 'someKey';

                                var promise = repository.addHint(hintKey);

                                httpWrapperPostDeffered.resolve({ Name: hintKey });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response does not have Id string');
                                });
                            });

                        });
                        
                        describe('and response doesn`t have Name', function () {

                            it('should reject promise', function () {
                                var hintKey = 'someKey';

                                var promise = repository.addHint(hintKey);

                                httpWrapperPostDeffered.resolve({ Id: 'someId' });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeRejectedWith('Response does not have Name string');
                                });
                            });

                        });

                        describe('and response have Id and Name', function () {
                            
                            it('should add hint to dataContext', function () {
                                dataContext.helpHints = [];
                                var hintKey = 'someKey';
                                var response = { Id: 'someId', Name: hintKey };

                                var promise = repository.addHint(hintKey);

                                httpWrapperPostDeffered.resolve(response);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(dataContext.helpHints.length).toBe(1);
                                });
                            });
                            

                            it('should resolve promise with new hint', function () {
                                dataContext.helpHints = [];
                                var hintKey = 'someKey';
                                var response = { Id: 'someId', Name: hintKey };
                                var expected = { id: 'someId', name: hintKey, localizationKey: hintKey + 'HelpHint' };

                                var promise = repository.addHint(hintKey);

                                httpWrapperPostDeffered.resolve(response);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolvedWith(expected);
                                });
                            });
                            
                        });

                    });

                });
                
            });
        });
    }
);