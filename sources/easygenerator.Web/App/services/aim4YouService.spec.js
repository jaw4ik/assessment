define(['dataContext', 'plugins/http', 'services/aim4YouService'], function (dataContext, http, service) {

    describe('service [registerOnAim4You]', function () {

        var httpPost;

        beforeEach(function () {
            httpPost = $.Deferred();
            spyOn(http, 'post').andReturn(httpPost.promise());
        });

        it('should be defined', function () {
            expect(service).toBeDefined();
        });

        describe('register:', function () {

            it('should be function', function () {
                expect(service.register).toBeFunction();
            });

            it('should return promise', function () {
                expect(service.register()).toBePromise();
            });

            it('should send request to server to api/registerUserOnAim4You', function () {
                var promise = service.register();

                httpPost.resolve();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(http.post).toHaveBeenCalledWith('api/registerUserOnAim4You');
                });
            });

            describe('when response is successful', function () {

                describe('and when response has invalid format', function () {

                    beforeEach(function () {
                        httpPost.resolve(undefined);
                    });

                    it('should reject promise with \'Response has invalid format\'', function () {
                        var promise = service.register();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('Response has invalid format');
                        });
                    });

                });

                describe('and when user is registered in Aim4You', function () {

                    beforeEach(function () {
                        httpPost.resolve({ success: true });
                    });

                    it('should update isRegisteredInAim4You in dataContext to true', function () {
                        dataContext.isRegisteredOnAim4You = false;
                        var promise = service.register();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(dataContext.isRegisteredOnAim4You).toBeTruthy();
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = service.register();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

                describe('and when user is not registered in Aim4You', function () {

                    describe('and response has error message', function () {

                        beforeEach(function () {
                            httpPost.resolve({ success: false, message: 'some error' });
                        });

                        it('should reject promise with \'some error\'', function () {
                            var promise = service.register();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeRejectedWith('some error');
                            });
                        });

                    });

                });

            });

        });

    });

});