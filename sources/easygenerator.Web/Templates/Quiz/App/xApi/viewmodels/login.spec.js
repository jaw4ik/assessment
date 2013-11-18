define(['./login', 'xApi/xApiInitializer', 'durandal/app', 'plugins/router', 'context', 'xApi/errorsHandler'],
    function (viewModel, xApiInitializer, app, router, context, errorsHandler) {

        "use strict";

        describe('viewModel [login]', function () {

            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });

            beforeEach(function () {
                spyOn(router, 'navigate');
                spyOn(app, 'trigger');
                spyOn(xApiInitializer, 'turnOff');
            });

            describe('usermail:', function () {

                it('should be observable', function () {
                    expect(viewModel.usermail).toBeObservable();
                });

                describe('getValue:', function () {

                    it('should be function', function () {
                        expect(viewModel.usermail.getValue).toBeFunction();
                    });

                    it('should return trimmed value', function () {
                        viewModel.usermail('     some text     ');
                        expect(viewModel.usermail.getValue()).toBe('some text');
                    });

                });

                describe('isModified', function () {

                    it('should be observable', function () {
                        expect(viewModel.usermail).toBeObservable();
                    });

                    it('should be false by default', function () {
                        expect(viewModel.usermail.isModified()).toBeFalsy();
                    });

                });

                describe('markAsModified', function () {

                    it('should be function', function () {
                        expect(viewModel.usermail.markAsModified).toBeFunction();
                    });

                    it('should mark question as modified', function () {
                        viewModel.usermail.isModified(false);
                        viewModel.usermail.markAsModified();
                        expect(viewModel.usermail.isModified()).toBeTruthy();
                    });

                });

                describe('isValid:', function () {

                    it('should be computed', function () {
                        expect(viewModel.usermail.isValid).toBeComputed();
                    });

                    describe('when usermail is not a string', function () {

                        it('should be false', function () {
                            viewModel.usermail(null);
                            expect(viewModel.usermail.isValid()).toBeFalsy();
                        });

                    });

                    describe('when usermail is an empty string', function () {

                        it('should be true', function () {
                            viewModel.usermail('');
                            expect(viewModel.usermail.isValid()).toBeFalsy();
                        });

                    });

                    describe('when usermail is a not-e-mail string', function () {

                        it('should be true', function () {
                            viewModel.usermail('Username');
                            expect(viewModel.usermail.isValid()).toBeFalsy();
                        });

                    });

                    describe('when usermail is an email string', function () {

                        it('should be true', function () {
                            viewModel.usermail('username@easygenerator.com');
                            expect(viewModel.usermail.isValid()).toBeTruthy();
                        });

                    });

                });

            });

            describe('username:', function () {

                it('should be observable', function () {
                    expect(viewModel.username).toBeObservable();
                });

                describe('getValue:', function () {

                    it('should be function', function () {
                        expect(viewModel.username.getValue).toBeFunction();
                    });

                    it('should return trimmed value', function () {
                        viewModel.username('     some text     ');
                        expect(viewModel.username.getValue()).toBe('some text');
                    });

                });

                describe('isModified', function () {

                    it('should be observable', function () {
                        expect(viewModel.username).toBeObservable();
                    });

                    it('should be false by default', function () {
                        expect(viewModel.username.isModified()).toBeFalsy();
                    });

                });

                describe('markAsModified', function () {

                    it('should be function', function () {
                        expect(viewModel.username.markAsModified).toBeFunction();
                    });

                    it('should mark question as modified', function () {
                        viewModel.username.isModified(false);
                        viewModel.username.markAsModified();
                        expect(viewModel.username.isModified()).toBeTruthy();
                    });

                });

                describe('isValid:', function () {

                    it('should be computed', function () {
                        expect(viewModel.username.isValid).toBeComputed();
                    });

                    describe('when username is not a string', function () {

                        it('should be false', function () {
                            viewModel.username(null);
                            expect(viewModel.username.isValid()).toBeFalsy();
                        });

                    });

                    describe('when username is an empty string', function () {

                        it('should be true', function () {
                            viewModel.username('');
                            expect(viewModel.username.isValid()).toBeFalsy();
                        });

                    });

                    describe('when username consists of only white-spaces', function () {

                        it('should be true', function () {
                            viewModel.username('   ');
                            expect(viewModel.username.isValid()).toBeFalsy();
                        });

                    });

                    describe('when username is an email string', function () {

                        it('should be true', function () {
                            viewModel.username('username@easygenerator.com');
                            expect(viewModel.username.isValid()).toBeTruthy();
                        });

                    });

                });

            });

            describe('skip:', function () {

                it('should be function', function () {
                    expect(viewModel.skip).toBeFunction();
                });

                it('should turn off xApiInitializer', function () {
                    viewModel.skip();
                    expect(xApiInitializer.turnOff).toHaveBeenCalled();
                });

                it('should trigger event "courseStarted"', function () {
                    viewModel.skip();
                    expect(app.trigger).toHaveBeenCalledWith("courseStarted");
                });

                it('should navigate to home', function () {
                    viewModel.skip();
                    expect(router.navigate).toHaveBeenCalledWith('home');
                });

            });

            describe('login:', function () {

                it('should be function', function () {
                    expect(viewModel.login).toBeFunction();
                });

                describe('when usermail or username are not valid', function () {

                    beforeEach(function() {
                        viewModel.usermail("not e-mail");
                        viewModel.username("          ");
                    });

                    it('should mark username as modified', function() {
                        spyOn(viewModel.username, 'markAsModified');
                        viewModel.login();
                        expect(viewModel.username.markAsModified).toHaveBeenCalled();
                    });
                    
                    it('should mark usermail as modified', function () {
                        spyOn(viewModel.usermail, 'markAsModified');
                        viewModel.login();
                        expect(viewModel.usermail.markAsModified).toHaveBeenCalled();
                    });

                });

                describe('when usermail and username are valid', function () {

                    beforeEach(function () {
                        viewModel.usermail("test@mail.com");
                        viewModel.username("User");
                    });

                    it('should create actor data', function () {
                        spyOn(xApiInitializer, 'createActor');
                        viewModel.login();
                        expect(xApiInitializer.createActor).toHaveBeenCalledWith(viewModel.username(), viewModel.usermail());
                    });

                    var xApiInitializerInitDefer, xApiInitializerInitPromise;
                    beforeEach(function () {
                        xApiInitializerInitDefer = Q.defer();
                        xApiInitializerInitPromise = xApiInitializerInitDefer.promise.finally(function () { });;
                        spyOn(xApiInitializer, 'init').andReturn(xApiInitializerInitDefer.promise);
                    });

                    it('should init xApiInitializer', function () {
                        context.title = "Some title";
                        context.experienceId = "10";
                        
                        var
                            url = window.top.location.toString() + '?experience_id=' + context.experienceId,
                            actor = xApiInitializer.createActor(viewModel.username(), viewModel.usermail());

                        viewModel.login();
                        expect(xApiInitializer.init).toHaveBeenCalledWith(actor, context.title, url);
                    });

                    describe('and when xApiInitializer.init was rejected', function () {

                        it('should turn off xApiInitializer', function () {
                            xApiInitializerInitDefer.reject();
                            viewModel.login();
                            waitsFor(function() {
                                return !xApiInitializerInitPromise.isPending();
                            });
                            runs(function() {
                                expect(xApiInitializer.turnOff).toHaveBeenCalled();
                            });
                        });

                        it('should handle error', function () {
                            spyOn(errorsHandler, 'handleError');
                            xApiInitializerInitDefer.reject("Some reason");
                            viewModel.login();
                            waitsFor(function() {
                                return !xApiInitializerInitPromise.isPending();
                            });
                            runs(function() {
                                expect(errorsHandler.handleError).toHaveBeenCalledWith("Some reason");
                            });
                        });

                    });

                    describe('and when xApiInitializer.init was resolved', function () {

                        beforeEach(function () {
                            xApiInitializerInitDefer.resolve();
                            viewModel.login();
                        });

                        it('should trigger event "courseStarted"', function () {
                            waitsFor(function () {
                                return !xApiInitializerInitPromise.isPending();
                            });
                            runs(function () {
                                expect(app.trigger).toHaveBeenCalledWith("courseStarted");
                            });
                        });

                        it('should navigate to home', function () {
                            waitsFor(function () {
                                return !xApiInitializerInitPromise.isPending();
                            });
                            runs(function () {
                                expect(router.navigate).toHaveBeenCalledWith('home');
                            });
                        });

                    });

                });

            });

        });

    }
);